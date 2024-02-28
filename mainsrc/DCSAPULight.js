const DCSData = require('./DCSData');
const DeviceCongfig = require('../www/js/DeviceConfig');
const AllDevices = DeviceCongfig(false, false);
const {
  ipcMain
} = require('electron');
const log = require('electron-log');
const _ = require('lodash');
var Devices = {};
var Part = {};
var DevicesBacklightMode = {};
var RunBindLight = {};
var pidByPath = {};

const F18_STARTUP_PANEL = 48643;
const WINWING_THROTTLE_BASE1 = 48672;
const WINWING_THROTTLE_BASE1_F18_HANDLE = 48674;
const WINWING_THROTTLE_BASE2 = 0xBE30;
const WINWING_THROTTLE_BASE2_F18_HANDLE = 0xBE32;
const F18_TAKEOFF_PANEL = 0xBE04;
const F18_COMBAT_READY_PANEL = 0xBE05;

var WWTHID_JSAPI;

var IsEnable = true;
var store;

var NowAircraft = '';

function InitF18C () {
  DCSData.addOutput({
    0: {
      440: 0,
      3116: 0
    }
  });
}

function InitA10C2 () {
  DCSData.addOutput({
    0: {
      440: 0,
      3116: 0
    }
  });
}

function InitAV8BNA () {
  DCSData.addOutput({
    0: {
      440: 0,
      3116: 0
    }
  });
}

function setledControl (led, device, Path, serial_number, msg, init = false) {
  if (led == 'Backlight' || led == 'INST_PNL_Backlight' || led == 'Screen_Backlight') {
    var dev = DevicesBacklightMode[Path];
    if (dev !== undefined) {
      let id = device.led[led];
      if (id !== undefined) {
        if (_.isObject(id)) {
          if (init) {
            msg = id.init;
          }
          id = id.id
        }
        const func = (data) => {
          if (data !== undefined && data.mode === 'SYNCDCS') {
            WWTHID_JSAPI.SetLedStateBySerialNumber(serial_number, id, msg);
          }
        }
        if (dev.mode !== undefined) {
          func(dev);
        } else {
          if (dev[serial_number] !== undefined) {
            if (dev[serial_number].mode !== undefined) {
              func(dev[serial_number]);
            } else {
              for (const light in dev[serial_number]) {
                func(dev[serial_number][light]);
              }
            }
          }
        }
      }
    }
  } else {
    let id = device.led[led];
    if (id !== undefined) {
      if (_.isObject(id)) {
        if (init) {
          msg = id.init;
        }
        id = id.id
      }
      WWTHID_JSAPI.SetLedStateBySerialNumber(serial_number, id, msg);
    }
  }
}

function ResetAllDeviceLED (msg) {
  const ledFunc = (Path, pid, serial_number) => {
    try {
      const device = AllDevices[pid];
      if (device !== undefined) {
        if (device.led !== undefined) {
          for (const led in device.led) {
            setledControl(led, device, Path, serial_number, msg, true);
          }
        }
      }
    } catch (error) {
      // log.error(`${error}========>> ${AllDevices}`);
    }
  };
  for (const path in Part) {
    for (const pid in Part[path]) {
      const data = Part[path][pid];
      ledFunc(path, pid, data.serial_number);
    }
  }
}

// 加载配置文件的灯光映射
function openDCSEventBindConfig (NowAircraft) {
  try {
    const dcs_event_bind_config = require('../dcs_event_bind_config');

    var eventbindFunc = (recvs) => {
      for (const recv of recvs) {
        const number = recv.dcs_id.split('.');
        const data = {};
        const dataC = {};
        dataC[number[1]] = 'nil';
        data[number[0]] = dataC;
        DCSData.addOutput(data);
        DCSData.Receive(recv.dcs_id, function (msg) {
          const ledFunc = (Path, pid, serial_number) => {
            try {
              const device = AllDevices[pid];
              if (device !== undefined) {
                for (const led of recv.led) {
                  if (device.led !== undefined) {
                    let rmsg = msg;
                    if (recv.process !== undefined) {
                      rmsg = recv.process(recv.dcs_id, msg);
                    }
                    setledControl(led, device, Path, serial_number, Number(rmsg) * 255);
                  }
                }
              }
            } catch (error) {
              //  log.error(`${error}========>> ${AllDevices}`);
            }
          };
          if (recv.device_name === 0) {
            for (var path in Part) {
              for (var pid in Part[path]) {
                const data = Part[path][pid];
                ledFunc(path, pid, data.serial_number);
              }
            }
          } else {
            for (const device_name of recv.device_name) {
              const pid = AllDevices.PIDByName[device_name];
              if (pid !== undefined) {
                const Paths = pidByPath[pid];
                if (Paths !== undefined) {
                  for (const data of Paths) {
                    ledFunc(data.path, pid, data.serial_number);
                  }
                }
              }
            }
          }
        });
      }
    }

    const dcsEventBindConfig = store.get('dcs_event_bind_config');
    for (const aircraftObjects of dcs_event_bind_config) {
      for (const name of aircraftObjects.aircraft_name) {
        if (name == NowAircraft) {
          try {
            if (aircraftObjects.isResetLight == true && dcsEventBindConfig.isResetLight == true) {
              ResetAllDeviceLED(0);
            }
            eventbindFunc(aircraftObjects.recv);
          } catch (error) {
            log.error('eventbindFunc:' + (error == null ? 'unknown' : (error.stack || error).toString()));
          }
        }
      }
    }
  } catch (error) {
    log.error('openDCSEventBindConfig:' + (error == null ? 'unknown' : (error.stack || error).toString()));
  }
}

DCSData.AddInitFunc(function (air) {
  NowAircraft = air;

  if (NowAircraft == 'FA-18C_hornet') {
    InitF18C();
  } else if (NowAircraft == 'A-10C_2' || NowAircraft == 'A-10C') {
    InitA10C2();
  } else if (NowAircraft == 'AV8BNA') {
    InitAV8BNA();
  }

  openDCSEventBindConfig(NowAircraft);
});

var RADARState = 0;
// RADAR
DCSData.Receive('0.440', function (msg) {
  RADARState = msg;
});

module.exports.WWTHID = function (_HID, _store) {
  WWTHID_JSAPI = _HID;
  store = _store;
  /* var DCSAPULightEnable = store.get("DCSAPULightEnable");
  if (DCSAPULightEnable === false) {
    IsEnable = false;
  } */

  DevicesBacklightMode = store.get('DevicesBacklightMode');
  if (DevicesBacklightMode == undefined) {
    DevicesBacklightMode = {};
  }

  UpdateRunBindLight();
}

function UpdateRunBindLight () {
  RunBindLight = {};
  for (var path in DevicesBacklightMode) {
    var datas = DevicesBacklightMode[path];
    const func = (c, SerialNumber) => {
      if (c.mode === 'BINDTOAXIS' && c.BindDevice != '' && c.BindDevice != undefined) {
        var d = {
          BindDevice: path,
          SerialNumber: SerialNumber,
          BindAxis: c.BindAxis,
          light: c.light,
          IsReverse: c.IsReverse
        }
        if (RunBindLight[c.BindDevice] !== undefined) {
          RunBindLight[c.BindDevice].push(d);
        } else {
          RunBindLight[c.BindDevice] = [d];
        }
      }
    }
    if (datas !== undefined) {
      if (datas.mode !== undefined) {
        func(datas);
      } else {
        for (const SerialNumber in datas) {
          if (datas[SerialNumber].mode !== undefined) {
            func(datas[SerialNumber], SerialNumber);
          } else {
            for (const light in datas[SerialNumber]) {
              func(datas[SerialNumber][light], SerialNumber);
            }
          }
        }
      }
    }
  }
}

module.exports.Part = function (_Part) {
  Part = _Part;
  pidByPath = {};
  for (const path in Part) {
    for (const pid in Part[path]) {
      if (pidByPath[pid] === undefined) {
        pidByPath[pid] = [];
      }
      const data = Part[path][pid];
      pidByPath[pid].push({ serial_number: data.serial_number, path: path });
    }
  }
}

module.exports.Devices = function (_Devices) {
  Devices = _Devices;
}

var F18_PCR_DATA;
var F18_PTO_DATA;

function AirSendToDCS (id, val) {
  if (NowAircraft === 'FA-18C_hornet') {
    DCSData.SendToDCS(id, val);
  }
}

setInterval(function () {
  if (F18_PCR_DATA != undefined) {
    // RADAR旋钮
    if (F18_PCR_DATA.rgbButtons[15]) {
      if (RADARState < -0.03 || RADARState > 0.03) {
        if (RADARState > 0.27 && RADARState < 0.33) {
          AirSendToDCS('42.3002', 1);
        }
        AirSendToDCS('42.3001', 0.0);
      } else {
        AirSendToDCS('42.3002', 0);
      }
    } else if (F18_PCR_DATA.rgbButtons[16]) {
      if (RADARState < 0.07 || RADARState > 0.13) {
        if (RADARState > 0.27 && RADARState < 0.33) {
          AirSendToDCS('42.3002', 1);
        }
        AirSendToDCS('42.3001', 0.1);
      } else {
        AirSendToDCS('42.3002', 0);
      }
    } else if (F18_PCR_DATA.rgbButtons[17]) {
      if (RADARState < 0.17 || RADARState > 0.23) {
        if (RADARState > 0.27 && RADARState < 0.33) {
          AirSendToDCS('42.3002', 1);
        }
        AirSendToDCS('42.3001', 0.2);
      } else {
        AirSendToDCS('42.3002', 0);
      }
    } else if (F18_PCR_DATA.rgbButtons[18]) {
      AirSendToDCS('42.3002', 1);
    } else if (F18_PCR_DATA.rgbButtons[19]) {
      if (RADARState < 0.27 || RADARState > 0.33) {
        AirSendToDCS('42.3002', 1);
        AirSendToDCS('42.3001', 0.3);
      } else {
        AirSendToDCS('42.3002', 0);
      }
    }
    // ECM XMIT旋钮
    if (F18_PCR_DATA.rgbButtons[31]) {
      AirSendToDCS('0.3116', 0.0);
    } else if (F18_PCR_DATA.rgbButtons[32]) {
      AirSendToDCS('0.3116', 0.1);
    } else if (F18_PCR_DATA.rgbButtons[33]) {
      AirSendToDCS('0.3116', 0.2);
    } else if (F18_PCR_DATA.rgbButtons[34]) {
      AirSendToDCS('0.3116', 0.3);
    } else if (F18_PCR_DATA.rgbButtons[35]) {
      AirSendToDCS('0.3116', 0.4);
    }
  }
  /* if (F18_PTO_DATA != undefined) {
    // SELECT JETT
    if (F18_PTO_DATA.rgbButtons[11]) {
      AirSendToDCS('23.3011', -0.1);
    } else if (F18_PTO_DATA.rgbButtons[12]) {
      AirSendToDCS('23.3011', 0.0);
    } else if (F18_PTO_DATA.rgbButtons[13]) {
      AirSendToDCS('23.3011', 0.1);
    } else if (F18_PTO_DATA.rgbButtons[14]) {
      AirSendToDCS('23.3011', 0.2);
    } else if (F18_PTO_DATA.rgbButtons[15]) {
      AirSendToDCS('23.3011', 0.3);
    }
    // WING FOLD
    if (F18_PTO_DATA.rgbButtons[24]) {
      AirSendToDCS('2.3011', -1);
    } else if (F18_PTO_DATA.rgbButtons[25]) {
      AirSendToDCS('2.3011', 0.1);
    } else if (F18_PTO_DATA.rgbButtons[26]) {
      AirSendToDCS('2.3011', 1);
    }
  } */
}, 1000);

var SELECT_JETT_Timeout;

module.exports.CB_InputData = function (Data) {
  try {
    if (Devices[Data.DevPath].pid == F18_COMBAT_READY_PANEL) {
      if (F18_PCR_DATA != undefined) {
        // RADAR旋钮
        if (Data.Data.rgbButtons[15]) {
          if (Data.Data.rgbButtons[15] != F18_PCR_DATA.rgbButtons[15]) {
            AirSendToDCS('42.3001', 0.0);
          }
        } else if (Data.Data.rgbButtons[16]) {
          if (Data.Data.rgbButtons[16] != F18_PCR_DATA.rgbButtons[16]) {
            AirSendToDCS('42.3001', 0.1);
          }
        } else if (Data.Data.rgbButtons[17]) {
          if (Data.Data.rgbButtons[17] != F18_PCR_DATA.rgbButtons[17]) {
            AirSendToDCS('42.3001', 0.2);
          }
        } else if (Data.Data.rgbButtons[18]) {
          if (Data.Data.rgbButtons[18] != F18_PCR_DATA.rgbButtons[18]) {
            AirSendToDCS('42.3002', 1);
          }
        } else if (Data.Data.rgbButtons[19]) {
          if (Data.Data.rgbButtons[19] != F18_PCR_DATA.rgbButtons[19]) {
            AirSendToDCS('42.3001', 0.3);
          }
        }
        // ECM XMIT旋钮
        if (Data.Data.rgbButtons[31]) {
          if (Data.Data.rgbButtons[31] != F18_PCR_DATA.rgbButtons[31]) { AirSendToDCS('0.3116', 0.0); }
        } else if (Data.Data.rgbButtons[32]) {
          if (Data.Data.rgbButtons[32] != F18_PCR_DATA.rgbButtons[32]) { AirSendToDCS('0.3116', 0.1); }
        } else if (Data.Data.rgbButtons[33]) {
          if (Data.Data.rgbButtons[33] != F18_PCR_DATA.rgbButtons[33]) { AirSendToDCS('0.3116', 0.2); }
        } else if (Data.Data.rgbButtons[34]) {
          if (Data.Data.rgbButtons[34] != F18_PCR_DATA.rgbButtons[34]) { AirSendToDCS('0.3116', 0.3); }
        } else if (Data.Data.rgbButtons[35]) {
          if (Data.Data.rgbButtons[35] != F18_PCR_DATA.rgbButtons[35]) { AirSendToDCS('0.3116', 0.4); }
        }
      }
      F18_PCR_DATA = Data.Data;
    } else if (Devices[Data.DevPath].pid == F18_TAKEOFF_PANEL) {
      if (F18_PTO_DATA != undefined) {
        // HOOK BYPASS FIECO
        /* if (Data.Data.rgbButtons[19]) {
          if (Data.Data.rgbButtons[19] != F18_PTO_DATA.rgbButtons[19])
            AirSendToDCS("9.3009", 0.6);
        } else if (Data.Data.rgbButtons[20]) {
          if (Data.Data.rgbButtons[20] != F18_PTO_DATA.rgbButtons[20])
            AirSendToDCS("9.3009", 0.4);
        } */

        const func_SELECT_JETT_Timeout = () => {
          clearTimeout(SELECT_JETT_Timeout);
          SELECT_JETT_Timeout = setTimeout(() => {
            if (Data.Data.rgbButtons[11]) {
              AirSendToDCS('23.3011', -0.1);
            } else if (Data.Data.rgbButtons[12]) {
              AirSendToDCS('23.3011', 0.0);
            } else if (Data.Data.rgbButtons[13]) {
              AirSendToDCS('23.3011', 0.1);
            } else if (Data.Data.rgbButtons[14]) {
              AirSendToDCS('23.3011', 0.2);
            } else if (Data.Data.rgbButtons[15]) {
              AirSendToDCS('23.3011', 0.3);
            }
          }, 300);
        }

        // SELECT JETT
        if (Data.Data.rgbButtons[11]) {
          if (Data.Data.rgbButtons[11] != F18_PTO_DATA.rgbButtons[11]) { AirSendToDCS('23.3011', -0.1); func_SELECT_JETT_Timeout(); }
        } else if (Data.Data.rgbButtons[12]) {
          if (Data.Data.rgbButtons[12] != F18_PTO_DATA.rgbButtons[12]) { AirSendToDCS('23.3011', 0.0); func_SELECT_JETT_Timeout(); }
        } else if (Data.Data.rgbButtons[13]) {
          if (Data.Data.rgbButtons[13] != F18_PTO_DATA.rgbButtons[13]) { AirSendToDCS('23.3011', 0.1); func_SELECT_JETT_Timeout(); }
        } else if (Data.Data.rgbButtons[14]) {
          if (Data.Data.rgbButtons[14] != F18_PTO_DATA.rgbButtons[14]) { AirSendToDCS('23.3011', 0.2); func_SELECT_JETT_Timeout(); }
        } else if (Data.Data.rgbButtons[15]) {
          if (Data.Data.rgbButtons[15] != F18_PTO_DATA.rgbButtons[15]) { AirSendToDCS('23.3011', 0.3); func_SELECT_JETT_Timeout(); }
        }
        // WING FOLD
        if (Data.Data.rgbButtons[24]) {
          if (Data.Data.rgbButtons[24] != F18_PTO_DATA.rgbButtons[24]) { AirSendToDCS('2.3011', -1); }
        } else if (Data.Data.rgbButtons[25]) {
          if (Data.Data.rgbButtons[25] != F18_PTO_DATA.rgbButtons[25]) { AirSendToDCS('2.3011', 0.1); }
        } else if (Data.Data.rgbButtons[26]) {
          if (Data.Data.rgbButtons[26] != F18_PTO_DATA.rgbButtons[26]) { AirSendToDCS('2.3011', 1); }
        }
        if (Data.Data.rgbButtons[27] != F18_PTO_DATA.rgbButtons[27]) {
          setTimeout(() => {
            if (Data.Data.rgbButtons[24]) {
              AirSendToDCS('2.3011', -1);
            } else if (Data.Data.rgbButtons[25]) {
              AirSendToDCS('2.3011', 0.1);
            } else if (Data.Data.rgbButtons[26]) {
              AirSendToDCS('2.3011', 1);
            }
          }, 300);
        }
      }
      F18_PTO_DATA = Data.Data;
    }

    var dev = RunBindLight[Data.DevPath];
    if (dev === undefined) {
      return;
    }
    for (var a of dev) {
      if (Devices[a.BindDevice] !== undefined) {
        var Num = 0;
        switch (a.BindAxis) {
          case 0:
            Num = Data.Data.lX;
            break;
          case 1:
            Num = Data.Data.lY;
            break;
          case 2:
            Num = Data.Data.lZ;
            break;
          case 3:
            Num = Data.Data.lRx;
            break;
          case 4:
            Num = Data.Data.lRy;
            break;
          case 5:
            Num = Data.Data.lRz;
            break;
          case 6:
            Num = Data.Data.rglSlider[0];
            break;
          case 7:
            Num = Data.Data.rglSlider[1];
            break;
          default:
            return;
        }
        if (a.SerialNumber === undefined) {
          WWTHID_JSAPI.SetLedState(a.BindDevice, a.light, a.IsReverse ? (65535 - Number(Num)) / 65535 * 255 : Number(Num) / 65535 * 255);
        } else {
          WWTHID_JSAPI.SetLedStateBySerialNumber(a.SerialNumber, a.light, a.IsReverse ? (65535 - Number(Num)) / 65535 * 255 : Number(Num) / 65535 * 255);
        }
      }
    }
  } catch (error) { }
}

ipcMain.on('WWTHID_GetDCSAPULightEnable', function (event, arg) {
  event.returnValue = IsEnable;
})

ipcMain.on('WWTHID_SetDCSAPULightEnable', function (event, arg) {
  IsEnable = arg;
  store.set('DCSAPULightEnable', arg);
})

ipcMain.on('WWTHID_GetDevicesBacklightMode', function (event, arg) {
  var r;
  if (arg.SerialNumber === undefined) {
    r = DevicesBacklightMode[arg.Handle];
  } else {
    r = DevicesBacklightMode[arg.Handle];
    if (_.isEmpty(r)) {
      r = undefined;
    } else {
      if (r.mode === undefined && r[arg.SerialNumber] !== undefined) {
        if (r[arg.SerialNumber].mode === undefined) {
          r = r[arg.SerialNumber][arg.light]
        } else {
          r = r[arg.SerialNumber]
        }
      }
    }
  }

  if (r == undefined) {
    r = {
      mode: 'SETTING',
      BindDevice: '',
      BindAxis: 0,
      light: 0,
      IsReverse: false
    };
  }
  event.returnValue = r;
})

ipcMain.on('WWTHID_SetDevicesBacklightMode', function (event, arg) {
  if (arg.SerialNumber !== undefined) {
    if (!_.isObject(DevicesBacklightMode[arg.key]) || DevicesBacklightMode[arg.key].mode !== undefined) {
      DevicesBacklightMode[arg.key] = {};
    }
    if (arg.light !== undefined) {
      if (!_.isObject(DevicesBacklightMode[arg.key][arg.SerialNumber]) || DevicesBacklightMode[arg.key][arg.SerialNumber].mode !== undefined) {
        DevicesBacklightMode[arg.key][arg.SerialNumber] = {};
      }
      DevicesBacklightMode[arg.key][arg.SerialNumber][arg.light] = arg.value;
    } else {
      DevicesBacklightMode[arg.key][arg.SerialNumber] = arg.value;
    }
  } else {
    DevicesBacklightMode[arg.key] = arg.value;
  }
  UpdateRunBindLight();
  store.set('DevicesBacklightMode', DevicesBacklightMode);
})
