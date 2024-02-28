
var fs = require('fs');
const path = require('path');
const DCSData = require('./DCSData');

var LCDContolCommons = require('require-all')(path.join(__dirname, 'LCDContolCommon'));
const DeviceCongfig = require('../www/js/DeviceConfig');
const AllDevices = DeviceCongfig(false, false);

var WWTHID_JSAPI;
// var store;
var GetPath;
// 字符查询结构表
var QueryScreenCharMapping = {};
// 每个设备的内存映射
var QueryDeviceScreenMemoryMapping = {};

var NowAircraft;

// 设备内存缓存
var DeviceMemoryMapping = {};

var initAircraftFunc = {};
var CB_addCommonFunc = {};

var PartByPath;

var isRunGameTask = false;

var testDemo = () => {
  var Chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  runAllDeivce((Part, pid) => {
    this.clearLcdData(Part.serial_number);
    this.sendData(Part.serial_number, pid, 0, 'C');
    this.sendData(Part.serial_number, pid, 2, '0');
    this.sendData(Part.serial_number, pid, 3, '1');
    this.sendData(Part.serial_number, pid, 4, '2');
    this.sendData(Part.serial_number, pid, 5, '3');
    this.sendData(Part.serial_number, pid, 6, '4');
    this.sendData(Part.serial_number, pid, 7, '5');
    this.sendData(Part.serial_number, pid, 8, '6');
    this.sendData(Part.serial_number, pid, 9, ':');
    this.sendData(Part.serial_number, pid, 14, ':');
    this.sendData(Part.serial_number, pid, 19, ':');
    this.sendData(Part.serial_number, pid, 24, ':');
    this.sendData(Part.serial_number, pid, 29, ':');
    this.update(Part.serial_number);
    var a = 0;
    setInterval(() => {
      /* this.sendData(Part.serial_number, pid, 8, (a).toString());
      a++;
      if (a >= 10) {
        a = 0;
      } */
      this.sendData(Part.serial_number, pid, 35, Chars[a]);
      a++;
      if (a >= Chars.length) {
        a = 0;
      }
      this.update(Part.serial_number);
    }, 500);
  })
}

var CB_addCommon = (msg) => {
  const addCommons = CB_addCommonFunc[NowAircraft];
  if (addCommons !== undefined) {
    for (const func of addCommons) {
      if (msg && msg[NowAircraft] !== undefined) {
        func(msg[NowAircraft]);
      }
    }
  }
}

var AddInitFunc = (air) => {
  NowAircraft = air;

  // 任务开始时，初始化所有设备的屏幕
  this.runAllDeivce((Part, pid) => {
    this.clearLcdData(Part.serial_number);
  })

  const initAircraft = initAircraftFunc[NowAircraft];
  if (initAircraft !== undefined) {
    for (const func of initAircraft) {
      func(NowAircraft);
    }
  }
  DCSData.ADD_CB_addCommon(CB_addCommon);
  isRunGameTask = true;
}

var AddEndFunc = () => {
  isRunGameTask = false;
}

module.exports.addinitAircraft = function (key, func) {
  if (initAircraftFunc[key] === undefined) {
    initAircraftFunc[key] = [];
  }
  initAircraftFunc[key].push(func);
}

module.exports.CB_addCommonAircraft = function (key, func) {
  if (CB_addCommonFunc[key] === undefined) {
    CB_addCommonFunc[key] = [];
  }
  CB_addCommonFunc[key].push(func);
}

module.exports.runAllDeivce = function (func, Pid) {
  const runFunc = (Parts, pid) => {
    for (const Part of Parts) {
      const BufferData = DeviceMemoryMapping[Part.serial_number];
      if (BufferData !== undefined) {
        func(Part, pid, BufferData);
      }
    }
  };
  if (Pid === undefined) {
    for (const pid in PartByPath) {
      const Parts = PartByPath[pid];
      runFunc(Parts, pid);
    }
  } else {
    const Parts = PartByPath[Pid];
    if (Parts !== undefined) {
      runFunc(Parts, Pid);
    }
  }
}

module.exports.Part = function (_Part) {
  const Part = _Part;
  PartByPath = {};
  for (const path in Part) {
    for (const pid in Part[path]) {
      if (PartByPath[pid] === undefined) {
        PartByPath[pid] = [];
      }
      const PartData = Part[path][pid];
      this.checkDeviceMemory(PartData.serial_number, pid);
      if (isRunGameTask) {
        this.sendLastBuff(PartData.serial_number);
      }

      PartByPath[pid].push(PartData);
    }
  }
}

module.exports.init = function (WWTHIDJSAPI, _store, _GetPath) {
  WWTHID_JSAPI = WWTHIDJSAPI;
  // store = _store;
  GetPath = _GetPath;
  const mainPath = GetPath.GetMainAsarPath();
  const ScreenCharMappingPath = path.join(mainPath, 'config/ScreenCharMapping/ScreenCharMapping.json');
  const deviceScreenMemoryMappingPath = path.join(mainPath, 'config/ScreenCharMapping/deviceScreenMemoryMapping.json');

  var ScreenCharMapping;
  var deviceScreenMemoryMapping;
  try {
    const dataSCM = fs.readFileSync(ScreenCharMappingPath, 'utf8');
    ScreenCharMapping = JSON.parse(dataSCM);
    const dataDSM = fs.readFileSync(deviceScreenMemoryMappingPath, 'utf8');
    deviceScreenMemoryMapping = JSON.parse(dataDSM);
  } catch (error) {
    console.log('打开文件失败');
  }

  if (ScreenCharMapping !== undefined && deviceScreenMemoryMapping !== undefined) {
    for (const data of ScreenCharMapping) {
      if (QueryScreenCharMapping[data.type] === undefined) {
        QueryScreenCharMapping[data.type] = {};
      }
      QueryScreenCharMapping[data.type][data.char] = data;
    }

    for (const deviceData of deviceScreenMemoryMapping) {
      for (const data of deviceData.datas) {
        const func = (datas) => {
          for (let a = 0; a < datas.length; a++) {
            datas[a] = Number(datas[a]) + Number(data.startPos);
          }
        }
        if (data.type == 0) {
          func(data.addr_shape_square);
        } else if (data.type == 1) {
          func(data.addr_shape_8);
        } else {
          func(data.addr_shape_1);
        }
      }
      QueryDeviceScreenMemoryMapping[deviceData.pid] = deviceData;
    }

    DCSData.AddInitFunc(AddInitFunc);

    DCSData.AddEndFunc(AddEndFunc);

    /* setTimeout(() => {
      testDemo();
    }, 5000); */

    for (const con in LCDContolCommons) {
      const data = LCDContolCommons[con];
      if (data.init !== undefined) {
        data.init(this, DCSData, AllDevices);
      }
    }
  }
};

module.exports.checkDeviceMemory = function (SerialNumber, pid) {
  if (DeviceMemoryMapping[SerialNumber] === undefined) {
    const deviceData = QueryDeviceScreenMemoryMapping[pid];
    if (deviceData !== undefined) {
      DeviceMemoryMapping[SerialNumber] = {
        pid: pid,
        lastBuffer: new Array(deviceData.memorySize).fill(0),
        buffer: new Array(deviceData.memorySize).fill(0),
        sendQueue: []
      };
    }
  }
  return DeviceMemoryMapping[SerialNumber];
}

// 下发全部缓存内容
module.exports.sendLastBuff = function (SerialNumber) {
  const BufferData = DeviceMemoryMapping[SerialNumber];
  if (BufferData !== undefined) {
    var updateMany = [];
    for (let a = 0; a < BufferData.buffer.length;) {
      const group = Math.floor(a / 4);
      const pos = group * 4;
      updateMany.push({
        group: group,
        Data: [
          BufferData.lastBuffer[pos],
          BufferData.lastBuffer[pos + 1],
          BufferData.lastBuffer[pos + 2],
          BufferData.lastBuffer[pos + 3]
        ]
      });
      a = (group + 1) * 4;
    }
    if (updateMany.length > 0) {
      for (const data of updateMany) {
        WWTHID_JSAPI.SetLcdState(SerialNumber, data.group, data.Data);
        // this.SetLcdState(BufferData, { SerialNumber, group: data.group, Data: data.Data });
      }
    }
  }
}

module.exports.update = function (SerialNumber) {
  var updateMany = [];
  const BufferData = DeviceMemoryMapping[SerialNumber];
  if (BufferData !== undefined) {
    for (let a = 0; a < BufferData.buffer.length;) {
      if (BufferData.buffer[a] != BufferData.lastBuffer[a]) {
        const group = Math.floor(a / 4);
        const pos = group * 4;
        BufferData.lastBuffer[pos] = BufferData.buffer[pos];
        BufferData.lastBuffer[pos + 1] = BufferData.buffer[pos + 1];
        BufferData.lastBuffer[pos + 2] = BufferData.buffer[pos + 2];
        BufferData.lastBuffer[pos + 3] = BufferData.buffer[pos + 3];
        updateMany.push({
          group: Math.floor(a / 4),
          Data: [
            BufferData.lastBuffer[pos],
            BufferData.lastBuffer[pos + 1],
            BufferData.lastBuffer[pos + 2],
            BufferData.lastBuffer[pos + 3]
          ]
        });
        a = (group + 1) * 4;
      } else {
        a++;
      }
    }
  }
  if (updateMany.length > 0) {
    for (const data of updateMany) {
      WWTHID_JSAPI.SetLcdState(SerialNumber, data.group, data.Data);
      // this.SetLcdState(BufferData, { SerialNumber, group: data.group, Data: data.Data });
    }
  }
}

module.exports.clearLcdData = function (SerialNumber) {
  const BufferData = DeviceMemoryMapping[SerialNumber];

  if (BufferData !== undefined) {
    for (let a = 0; a < BufferData.buffer.length; a++) {
      BufferData.buffer[a] = 0;
      BufferData.lastBuffer[a] = 0;
    }
  }
  for (let a = 0, end = BufferData.buffer.length / 4; a < end; a++) {
    WWTHID_JSAPI.SetLcdState(SerialNumber, a, [0, 0, 0, 0]);
    // this.SetLcdState(BufferData, { SerialNumber, group: a, Data: [0, 0, 0, 0] });
  }
}

// 延迟缓存发送
module.exports.SetLcdState = function (BufferData, data) {
  BufferData.sendQueue.push(data);

  if (BufferData.sendQueueInterval === undefined) {
    BufferData.sendQueueInterval = setInterval(() => {
      if (BufferData.sendQueue.length > 0) {
        const data = BufferData.sendQueue[0];
        WWTHID_JSAPI.SetLcdState(data.SerialNumber, data.group, data.Data);
        BufferData.sendQueue.splice(0, 1);
      } else {
        clearInterval(BufferData.sendQueueInterval);
        BufferData.sendQueueInterval = undefined;
      }
    }, 1);
  }
}

module.exports.sendData = function (SerialNumber, pid, pos, char) {
  const deviceData = QueryDeviceScreenMemoryMapping[pid];
  if (deviceData !== undefined) {
    const BufferData = DeviceMemoryMapping[SerialNumber];

    if (pos >= 0 && pos < deviceData.datas.length && BufferData !== undefined) {
      const memMap = deviceData.datas[pos];
      const charMap = QueryScreenCharMapping[memMap.type];
      if (charMap !== undefined) {
        const charData = charMap[char];
        if (charData !== undefined) {
          const func = (addrDatas, Datas) => {
            for (let a = 0; a < addrDatas.length; a++) {
              const addr = addrDatas[a];
              const pos = Math.floor(addr / 8);
              if (Datas[a]) {
                BufferData.buffer[pos] |= (1 << (addr % 8));
              } else {
                BufferData.buffer[pos] &= ((1 << (addr % 8)) ^ 0xff);
              }
            }
          }
          if (memMap.type == 0) {
            func(memMap.addr_shape_square, charData.shape_square);
          } else if (memMap.type == 1) {
            func(memMap.addr_shape_8, charData.shape_8);
          } else {
            func(memMap.addr_shape_1, charData.shape_1);
          }
        } else {
          if (memMap.type == 0) {
            // 没有找到对应字符。检查是否能够融合(有两个字符就能融合)
            if (char.length == 2) {
              const func = (addrDatas, Datas0, Datas1) => {
                for (let a = 0; a < addrDatas.length; a++) {
                  const addr = addrDatas[a];
                  const pos = Math.floor(addr / 8);
                  if (Datas0[a] || Datas1[a]) {
                    BufferData.buffer[pos] |= (1 << (addr % 8));
                  } else {
                    BufferData.buffer[pos] &= ((1 << (addr % 8)) ^ 0xff);
                  }
                }
              }
              const charData0 = charMap[char[0]];
              const charData1 = charMap[' ' + char[1]];
              if (charData0 !== undefined && charData1 !== undefined) {
                func(memMap.addr_shape_square, charData0.shape_square, charData1.shape_square);
              }
            }
          }
        }
      }
    }
  }
}
