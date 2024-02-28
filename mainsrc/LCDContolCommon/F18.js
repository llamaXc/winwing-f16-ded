const _ = require('lodash')

var DCSData;
var LCDControl;
var AllDevices;

var DCSToCharPos = {
  UFC_Comm1Display: 34,
  UFC_Comm2Display: 35,
  UFC_MainDummy: 0,
  UFC_mask: 0,
  UFC_OptionCueing1: 9,
  UFC_OptionCueing2: 14,
  UFC_OptionCueing3: 19,
  UFC_OptionCueing4: 24,
  UFC_OptionCueing5: 29,
  UFC_OptionDisplay1: [10, 11, 12, 13],
  UFC_OptionDisplay2: [15, 16, 17, 18],
  UFC_OptionDisplay3: [20, 21, 22, 23],
  UFC_OptionDisplay4: [25, 26, 27, 28],
  UFC_OptionDisplay5: [30, 31, 32, 33],
  UFC_ScratchPadNumberDisplay: {
    reverse: true,
    datas: [2, 3, 4, 5, 6, 7, 8]
  },
  UFC_ScratchPadString1Display: 0,
  UFC_ScratchPadString2Display: 1
}

var initAircraft = (NowAircraft) => {
  var msg = {};
  msg[NowAircraft] = 'return ' + 'list_indication(6);';
  DCSData.addCommon(msg);
}

var addCommonAircraft = (msg) => {
  try {
    msg = DCSData.parseIndicationData(msg);

    const runFunc = (pos, value) => {
      if (value === undefined) {
        value = '';
      }
      LCDControl.runAllDeivce((Part, pid) => {
        LCDControl.sendData(Part.serial_number, pid, pos, value);
      },
      AllDevices.UFC1);
    };

    for (const key in msg) {
      const poss = DCSToCharPos[key];
      if (poss !== undefined) {
        const values = msg[key];
        if (_.isArray(poss)) {
          for (let a = 0; a < poss.length; a++) {
            runFunc(poss[a], values[a]);
          }
        } else if (_.isObject(poss)) {
          if (poss.reverse) {
            for (let a = poss.datas.length - 1; a >= 0; a--) {
              const b = poss.datas.length - a;
              runFunc(poss.datas[a], values[values.length - b]);
            }
          } else {
            for (let a = 0; a < poss.datas.length; a++) {
              runFunc(poss[a], values[a]);
            }
          }
        } else {
          LCDControl.runAllDeivce((Part, pid) => {
            LCDControl.sendData(Part.serial_number, pid, poss, values);
          },
          AllDevices.UFC1);
        }
      }
    }
    LCDControl.runAllDeivce((Part, pid) => {
      LCDControl.update(Part.serial_number);
    },
    AllDevices.UFC1);
  } catch (error) {
    console.log(error);
  }
}

module.exports.init = function (_LCDControl, _DCSData, _AllDevices) {
  LCDControl = _LCDControl;
  DCSData = _DCSData;
  AllDevices = _AllDevices;
  LCDControl.addinitAircraft('FA-18C_hornet', initAircraft);
  LCDControl.CB_addCommonAircraft('FA-18C_hornet', addCommonAircraft);
}
