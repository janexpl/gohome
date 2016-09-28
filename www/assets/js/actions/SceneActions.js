var Constants = require('../constants.js');
var Api = require('../utils/API.js');

var SceneActions = {
    create: function(sceneJson) {
        return function(dispatch) {
            dispatch({ type: Constants.SCENE_CREATE, clientId: sceneJson.clientId });

            Api.sceneCreate(sceneJson, function(err, data) {
                if (err) {
                    dispatch({ type: Constants.SCENE_CREATE_FAIL, err: err, clientId: sceneJson.clientId });
                    return;
                }
                dispatch({ type: Constants.SCENE_CREATE_RAW, data: data, clientId: sceneJson.clientId });
            });
        };
    },

    update: function(sceneJson) {
        return function(dispatch) {
            dispatch({ type: Constants.SCENE_UPDATE, id: sceneJson.id });

            Api.sceneUpdate(sceneJson, function(err, data) {
                if (err) {
                    dispatch({ type: Constants.SCENE_UPDATE_FAIL, err: err, id: sceneJson.id });
                    return;
                }
                dispatch({ type: Constants.SCENE_UPDATE_RAW, data: data, id: sceneJson.id, sceneJson: sceneJson });
            });
        };
    },

    destroyClient: function(clientId) {
        return function(dispatch) {
            dispatch({ type: Constants.SCENE_DESTROY, clientId: clientId });
            dispatch({ type: Constants.SCENE_DESTROY_RAW, clientId: clientId });
        };
    },

    destroy: function(id) {
        return function(dispatch) {
            dispatch({ type: Constants.SCENE_DESTROY, id: id });

            Api.sceneDestroy(id, function(err, data) {
                if (err) {
                    dispatch({ type: Constants.SCENE_DESTROY_FAIL, err: err, id: id });
                    return;
                }
                dispatch({ type: Constants.SCENE_DESTROY_RAW, data: data, id: id });
            });
        };
    },

    addCommand: function(sceneId, cmdType) {
        return function(dispatch) {
            dispatch({ type: Constants.SCENE_COMMAND_ADD, sceneId: sceneId, cmdType: cmdType });
        };
    },

    //TODO: Save command
    //TODO: Delete command (client only + server)

    loadAll: function() {
        return function(dispatch) {
            dispatch({ type: Constants.SCENE_LOAD_ALL });

            Api.sceneLoadAll(function(err, data) {
                if (err) {
                    dispatch({ type: Constants.SCENE_LOAD_ALL_FAIL, err: err });
                    return;
                }

                dispatch({ type: Constants.SCENE_LOAD_ALL_RAW, data: data });
            });
        };
    },

    newClient: function() {
        return {
            type: Constants.SCENE_NEW_CLIENT
        };
    }
};
module.exports = SceneActions;