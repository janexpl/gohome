package fluxwifi

import (
	"fmt"

	"github.com/markdaws/gohome"
	"github.com/markdaws/gohome/comm"
	fluxwifiExt "github.com/markdaws/gohome/fluxwifi"
	"github.com/markdaws/gohome/zone"
)

type discoverer struct {
	System *gohome.System
}

func (d *discoverer) Devices(sys *gohome.System, modelNumber string) ([]gohome.Device, error) {
	infos, err := fluxwifiExt.Scan(5)
	if err != nil {
		return nil, err
	}

	/*
		//TODO: Remove, for testing
		infos := [1]fluxwifi.BulbInfo{fluxwifi.BulbInfo{
			IP:    "192.168.0.1:1234",
			ID:    "thisisanid",
			Model: "modelnumber",
		}}*/

	devices := make([]gohome.Device, len(infos))
	for i, info := range infos {
		name := info.ID + ": " + info.Model
		modelNumber := "fluxwifi"
		builderID := modelNumber

		cmdBuilder, ok := sys.Extensions.CmdBuilders[builderID]
		if !ok {
			return nil, fmt.Errorf("unsupported command builder ID: %s", modelNumber)
		}

		dev, _ := gohome.NewDevice(
			modelNumber,
			info.IP,
			"",
			name,
			"",
			nil,
			false,
			cmdBuilder,
			&comm.ConnectionPoolConfig{
				Name:           name,
				Size:           2,
				ConnectionType: "telnet",
				Address:        info.IP,
				TelnetPingCmd:  "",
			},
			nil,
		)

		z := &zone.Zone{
			Address:     "",
			Name:        dev.Name,
			Description: "",
			DeviceID:    "",
			Type:        zone.ZTLight,
			Output:      zone.OTRGB,
		}
		dev.AddZone(z)
		devices[i] = *dev
	}
	return devices, nil
}