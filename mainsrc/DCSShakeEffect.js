const DCSData = require('./DCSData');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');
const _ = require('lodash');
const {
  app,
  ipcMain
} = require('electron')
const Global = require('../www/js/Global_Electron.js');
const DeviceCongfig = require('../www/js/DeviceConfig');
const AllDevices = DeviceCongfig(false, false);

var shake = {};
shake.directParam = {};
shake.indirectParam = {};
//* ****************************SimAppPro启动时初始化***************************************
// SIMAPP初始化时候，获取模型/点位地址/SHAKEEFFECT，若没有就创建/SHAKEEFFECT文件夹
shake.pathInit = () => {
  shake.userPath = app.getPath('userData');
  shake.effectPath = path.join(shake.userPath, 'ShakeEffect/effect');
  shake.activePath = path.join(shake.userPath, 'ShakeEffect/active');
  shake.defaultPath = path.join(shake.userPath, 'ShakeEffect/default');
  fs.mkdir(shake.userPath + '/ShakeEffect', {
    recursive: true
  }, (err) => {});
  fs.mkdir(shake.userPath + '/ShakeEffect/active', {
    recursive: true
  }, (err) => {});
  fs.mkdir(shake.userPath + '/ShakeEffect/active/DCS', {
    recursive: true
  }, (err) => {});
  fs.mkdir(shake.userPath + '/ShakeEffect/effect', {
    recursive: true
  }, (err) => {});
  fs.mkdir(shake.userPath + '/ShakeEffect/effect/DCS', {
    recursive: true
  }, (err) => {});
  fs.mkdir(shake.userPath + '/ShakeEffect/files', {
    recursive: true
  }, (err) => {});
  fs.mkdir(shake.userPath + '/ShakeEffect/default', {
    recursive: true
  }, (err) => {});
  fs.mkdir(shake.userPath + '/ShakeEffect/default/DCS', {
    recursive: true
  }, (err) => {});
}
// 校验模型文件在不在，是不是最新
shake.effectConfigUpdate = async () => {
  try {
    var filePrefix = 'VibrationEffect_V';
    var needDownload = true;
    // 获取版本信息
    var infoUrl = Global.getDownloadURL(shake.config) + 'VibrationEffect/' + shake.platform + '/UpdateInfo.json';
    var res = await Global.getJSONSync(infoUrl);
    if (_.isEmpty(res)) {
      return
    }
    var newFileName = res.fileName;
    // 获取本地文件
    var pathByPlatform = path.join(shake.effectPath, shake.platform);
    var fileArrayByDir = fs.readdirSync(pathByPlatform);
    for (var fileName of fileArrayByDir) {
      if (fileName.indexOf(filePrefix) == 0 && fileName.indexOf('.js') >= 0) {
        if (newFileName == fileName) {
          needDownload = false;
        } else {
          var filePath = path.join(pathByPlatform, fileName);
          fs.unlinkSync(filePath);
        }
      }
    }
    if (needDownload) {
      await Global.DownloadFileSync(Global.getDownloadURL(shake.config) + 'VibrationEffect/' + shake.platform + '/' + newFileName, pathByPlatform, newFileName);
    }
  } catch (err) {

  }
}
// 拷贝目录
var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};
// 从安装目录拷贝默认官方配置文件到用户配置目录
shake.shakeEffectConfigUpdate = () => {
  try {
    var defaultDir = path.join(Global.EventsPath, 'DynamicVibrationMotor');
    copyRecursiveSync(defaultDir, shake.defaultPath);
  } catch (err) {
    log.info(err);
  }
}
// 效果初始化
shake.init = async (dll, config) => {
  shake.dll = dll;
  shake.config = config;
  // 地址初始化
  shake.pathInit();
  // 获取设备模式
  shake.vibrationMotorConfig = config.get('DevicesDynamicVibrationMotorConfig') || {};
  // 检查模型更新并下载
  shake.platform = 'DCS';
  await shake.effectConfigUpdate();
  // 拷贝默认配置
  shake.shakeEffectConfigUpdate();
}
//* ***************************************************************************
//* ********************************DCS启动时初始化*************************************/
// 重载所有配置文件
shake.reloadConfig = () => {
  // 结束效果模型
  shake.end();
  // 清除设备振动
  // for(const pid in shake.partByPid){
  //   var part=shake.partByPid[pid]
  //   for(const motor in AllDevices[pid].DynamicVibrationMotor){
  //     const index=AllDevices[pid].DynamicVibrationMotor[motor];
  //     shake.dll.SetLedState(part.handle,index,0)
  //   }
  // }
  // 清除计算模型
  for (const fileName in shake.shakeEffectByFileName) {
    var shakeEffect = shake.shakeEffectByFileName[fileName];
    for (const effectKey in shakeEffect) {
      shake.dll.ContinuousModelDelete(effectKey);
    }
  }
  if (_.isEmpty(shake.partByPid) || _.isEmpty(shake.platform) || _.isEmpty(shake.aircraft)) {
    return;
  }
  // 重新加载
  shake.shakeValueByFileName = {};
  // 获取模型配置文件
  if (!shake.getEffectConfig()) {
    return
  }
  // 读取用户点位文件
  if (!shake.getShakeEffectConfig()) {
    return
  }
  // 合并上面两个文件为模型的输入对象
  if (!shake.getShakeEffect()) {
    return
  }
  // 向DCS请求数据
  shake.requestOutputData();
  shake.requestCommonData();
  // 根据输入文件和DCS入参进行定时计算
  shake.beg();
}
// DCS 任务开始
DCSData.AddInitFunc(function (aircraft) {
  shake.aircraft = aircraft;
  shake.platform = 'DCS';
  // 重载配置
  shake.reloadConfig();
  // 监听 DCS output 和 common
  DCSData.ADD_CB_addOutput(shake.CB_addOutput);
  DCSData.ADD_CB_addCommon(shake.CB_addCommon);
});
// DCS 任务结束
DCSData.AddEndFunc(() => {
  shake.aircraft = '';
  shake.platform = '';
  // 结束效果模型
  shake.end();
  shake.shakeValueByFileName = {}
  // 清除设备振动
  for (const pid in shake.partByPid) {
    var part = shake.partByPid[pid]
    for (const motor in AllDevices[pid].DynamicVibrationMotor) {
      const index = AllDevices[pid].DynamicVibrationMotor[motor];
      shake.dll.SetLedStateBySerialNumber(part.serial_number, index, 0)
    }
  }
  // 清除计算模型
  for (const fileName in shake.shakeEffectByFileName) {
    var shakeEffect = shake.shakeEffectByFileName[fileName];
    for (const effectKey in shakeEffect) {
      shake.dll.ContinuousModelDelete(effectKey);
    }
  }
});
// 将模型文件转为js
shake.dealJsFile = (data) => {
  var str = data;
  str = str.replace(/export *default/g, 'var func=()=>');
  str = str.replace(/export/g, '');
  str = str + '\r\nfunc();';
  return str;
}
// 给用户点位文件追加前缀和信息
shake.addEffectPrefix = (effect) => {
  // 直接参数
  var param = {};
  var paramId = 0;
  for (var paramKey in effect.directParam) {
    var directParam = effect.directParam[paramKey];
    var key = 'Direct_' + paramKey;
    param[key] = {
      ...directParam,
      id: ++paramId,
      param: paramKey,
      key: key,
      type: 'direct'
    };
  }
  // 间接参数
  for (var paramKey in effect.indirectParam) {
    var indirectParam = effect.indirectParam[paramKey];
    var key = 'Indirect_' + paramKey;
    param[key] = {
      ...indirectParam,
      id: ++paramId,
      param: paramKey,
      key: key,
      type: 'indirect'
    };
  }
  effect.param = param;
  return effect;
}
// 获取模型文件的配置
shake.getEffectConfig = async () => {
  if (_.isEmpty(shake.platform)) {
    return false;
  }
  try {
    // 读取DCS对应效果模板
    var pathByPlatform = path.join(shake.effectPath, shake.platform);
    var fileArrayByDir = fs.readdirSync(pathByPlatform);
    var config = {};
    // 用户可以按照相同规则，新建文件来扩展此模板，此处遍历文件夹所有文件再进行合并
    for (const file of fileArrayByDir) {
      if (!file.endsWith('.js')) {
        continue;
      }
      var filePath = path.join(pathByPlatform, file);
      var jsData = fs.readFileSync(filePath, {
        encoding: 'utf-8'
      });
      var effect = eval(shake.dealJsFile(jsData));
      // 将字符串转为js
      _.merge(config, effect);
    }
    // this.$set(this.$data,'effectConfig',config);
    shake.effectConfig = shake.addEffectPrefix(config);
    return true;
  } catch (err) {
    return false;
  }
}
// 获取用户点位
shake.getShakeEffectConfig = () => {
  // A1:获取active文件夹下对应平台和机型的文件（此文件唯一,当有多个时，只读第一个）
  if (_.isEmpty(shake.platform) || _.isEmpty(shake.aircraft)) {
    return false;
  }
  try {
    shake.shakeEffectConfigByFileName = {};
    // A2:遍历有振动马达的设备
    for (var pid in shake.partByPid) {
      var part = shake.partByPid[pid];
      var pathByAircraft;
      // A3:判断设备模式（禁用/默认/高级），获取对应文件夹地址或跳过
      if (part.mode == 'default') {
        pathByAircraft = path.join(shake.defaultPath, shake.platform, shake.aircraft);
      } else if (part.mode == 'advanced') {
        pathByAircraft = path.join(shake.activePath, shake.platform, shake.aircraft);
      } else {
        continue
      }
      // A4:读取文件夹内所有文件
      var fileArrayByDir = fs.readdirSync(pathByAircraft);
      // A5:遍历所有文件
      for (const fileName of fileArrayByDir) {
        // A6:获取零件名称
        var partName = fileName.slice(0, fileName.indexOf('{'));
        // A7:当文件和在线零件匹配时
        if (partName == part.name) {
          var filePath = path.join(pathByAircraft, fileName);
          var fileData = fs.readFileSync(filePath, {
            encoding: 'utf-8'
          });
          if (fileData.trim != '') {
            shake.shakeEffectConfigByFileName[fileName] = JSON.parse(fileData);
          }
        }
      }
    }
    return true;
  } catch (err) {
    return false;
  }
}
// 获取震动效果，合并效果模板和用户配置
shake.getShakeEffect = () => {
  var effectConfig = shake.effectConfig || {};
  var shakeEffectConfigByFileName = shake.shakeEffectConfigByFileName || {};
  if (_.isEmpty(effectConfig) || _.isEmpty(shakeEffectConfigByFileName)) {
    return false;
  }
  var shakeEffectByFileName = {};
  for (const fileName in shakeEffectConfigByFileName) {
    var shakeEffectConfig = shakeEffectConfigByFileName[fileName];
    var shakeEffect = {}
    for (const key in shakeEffectConfig) {
      const config = shakeEffectConfig[key];
      if (!config.enable || _.isEmpty(config.points)) {
        continue
      }
      const effectPrefix = 'Leaf_';
      const effectName = key.slice(effectPrefix.length);
      shakeEffect[key] = {
        key: key,
        points: config.points,
        xMin: config.xMin,
        xMax: config.xMax,
        vMin: config.vMin,
        vMax: config.vMax,
        cMin: config.cMin,
        cMax: config.cMax,
        directParam: {},
        indirectParam: {},
        shakeValue: 0,
        detail: effectConfig.treeLeaf[effectName]
      }
      if (config.xAxis) {
        var directPrefix = 'Direct_';
        var indirectPrefix = 'Indirect_';
        if (config.xAxis.indexOf(directPrefix) == 0) {
          var paramName = config.xAxis.slice(directPrefix.length);
          shakeEffect[key].directParam[paramName] = effectConfig.directParam[paramName];
          shake.directParam[paramName] = effectConfig.directParam[paramName];
        } else if (config.xAxis.indexOf(indirectPrefix) == 0) {
          var paramName = config.xAxis.slice(indirectPrefix.length);
          shakeEffect[key].indirectParam[paramName] = effectConfig.indirectParam[paramName];
          shake.indirectParam[paramName] = effectConfig.indirectParam[paramName];
          // 追加间接参数所需的直接参数
          for (const directParam of shakeEffect[key].indirectParam[paramName].directParam) {
            shakeEffect[key].directParam[directParam] = effectConfig.directParam[directParam];
            shake.directParam[directParam] = effectConfig.directParam[directParam];
          }
        }
      }
      if (config.cCondition) {
        var directPrefix = 'Direct_';
        var indirectPrefix = 'Indirect_';
        if (config.cCondition.indexOf(directPrefix) == 0) {
          var paramName = config.cCondition.slice(directPrefix.length);
          shakeEffect[key].directParam[paramName] = effectConfig.directParam[paramName];
          shake.directParam[paramName] = effectConfig.directParam[paramName];
        } else if (config.cCondition.indexOf(indirectPrefix) == 0) {
          var paramName = config.cCondition.slice(indirectPrefix.length);
          shakeEffect[key].indirectParam[paramName] = effectConfig.indirectParam[paramName];
          shake.indirectParam[paramName] = effectConfig.indirectParam[paramName];
          // 追加间接参数所需的直接参数
          for (const directParam of shakeEffect[key].indirectParam[paramName].directParam) {
            shakeEffect[key].directParam[directParam] = effectConfig.directParam[directParam];
            shake.directParam[directParam] = effectConfig.directParam[directParam];
          }
        }
      }
      for (const param of effectConfig.treeLeaf[effectName].paramArray) {
        if (param.type == 'direct') {
          shakeEffect[key].directParam[param.paramKey] = effectConfig.directParam[param.paramKey];
          shake.directParam[param.paramKey] = effectConfig.directParam[param.paramKey];
        } else if (param.type == 'indirect') {
          shakeEffect[key].indirectParam[param.paramKey] = effectConfig.indirectParam[param.paramKey];
          shake.indirectParam[param.paramKey] = effectConfig.indirectParam[param.paramKey];
          // 追加间接参数所需的直接参数
          for (const directParam of shakeEffect[key].indirectParam[param.paramKey].directParam) {
            shakeEffect[key].directParam[directParam] = effectConfig.directParam[directParam];
            shake.directParam[directParam] = effectConfig.directParam[directParam];
          }
        }
      }
      // for (const condition of config.conditionCurrent) {
      //   var directPrefix = 'Direct_';
      //   var indirectPrefix = 'Indirect_';
      //   if (condition.indexOf(directPrefix) == 0) {
      //     var paramName = condition.slice(directPrefix.length);
      //     shakeEffect[key].directParam[paramName] = effectConfig.directParam[paramName];
      //     shake.directParam[paramName]=effectConfig.directParam[paramName];
      //   } else if (condition.indexOf(indirectPrefix) == 0) {
      //     var paramName = condition.slice(indirectPrefix.length);
      //     shakeEffect[key].indirectParam[paramName] = effectConfig.indirectParam[paramName];
      //     shake.indirectParam[paramName]=effectConfig.indirectParam[paramName];
      //     //追加间接参数所需的直接参数
      //     for(const directParam of shakeEffect[key].indirectParam[paramName].directParam){
      //       shakeEffect[key].directParam[directParam] = effectConfig.directParam[directParam];
      //       shake.directParam[directParam]=effectConfig.directParam[directParam];
      //     }
      //   }
      // }
      // 将样本点发给振动计算模型
      shake.dll.ContinuousModelInit(key, config.points, {
        degreeOfcurve: 4,
        vmin: config.vMin || 0,
        vmax: config.vMax || 100
      });
      var ret = shake.dll.ContinuousModelOperatoion(key, config.xMin, config.cMin);
      if (ret.error || Number.isNaN(ret.data)) {
        log.error(key, ret);
        return false;
      }
    }
    shakeEffectByFileName[fileName] = shakeEffect;
  }
  shake.shakeEffectByFileName = shakeEffectByFileName;
  return true;
}
// 请求DCS数据，单个机型的接口
shake.requestOutputData = () => {
  // 直接参数，面向单个机型，每次启动任务，只需要调用一次，dcs数据变更再发过来
  for (const paramKey in shake.directParam) {
    const param = shake.directParam[paramKey];
    if (typeof (param.identifyMethod) == 'object') { // 调用lua output方法，面对单个机型
      var data = {}
      data[param.identifyMethod.device] = {};
      data[param.identifyMethod.device][param.identifyMethod.id] = 0;
      DCSData.addOutput(data);
    }
  }
}
// 请求DCS数据，面对所有机型的接口
shake.requestCommonData = () => {
  // 直接参数,公共接口，面向所有机型，暂时需要定时拉取
  for (const paramKey in shake.directParam) {
    const param = shake.directParam[paramKey];
    if (typeof (param.identifyMethod) == 'string') { // 调用公共方法，面对所有机型
      var msg = {};
      msg[paramKey] = 'return ' + param.identifyMethod;
      DCSData.addCommon(msg);
    }
  }
}
// TODO:获取DCS数据，单个机型的接口
shake.CB_addOutput = (msg) => {
  if (_.isEmpty(shake.timer)) {

  }
  // A1:更新直接参数的数值
  // log.info(msg);
  // for(const device in msg){
  //   for(const id in msg[device]){
  //     const val=msg[device][id];
  //   }
  // }
}
// 获取DCS数据，所有机型的接口
shake.CB_addCommon = (msg) => {
  if (_.isEmpty(shake.timer)) {
    return
  }
  // 更新直接参数的数值
  for (const key in msg) {
    var data = msg[key];
    var param = shake.directParam[key];
    if (shake.directParam[key] === undefined) {
      continue
    }
    param.value = data;
    // 缩放
    if (param.scale == undefined) {
      param.scale = 1;
    }
    var scale = param.scale || 1;
    param.scaleValue = param.value * scale;
    param.scaleOldValue = param.oldValue * scale;
    param.scaleMin = param.min * scale;
    param.scaleMax = param.max * scale;
  }
}
//* ************************************************************************************** */
//* ******************************************硬件相关******************************************** */
// 将由不同配置文件计算出的震动数值发给对应的硬件
shake.toHardware = () => {
  // 处理振动数值
  for (const pid in shake.partByPid) {
    // 如果设备被禁用则跳过
    if (shake.vibrationMotorConfig[pid].mode == 'disabled') {
      continue
    }
    var part = shake.partByPid[pid]
    for (const fileName in shake.shakeValueByFileName) {
      var devName = fileName.slice(0, fileName.indexOf('{'));
      // var guid=fileName.slice(fileName.indexOf("{")+1,fileName.indexOf('}'));
      if (devName == part.name) {
        var shakeValue = shake.shakeValueByFileName[fileName].value;
        var shakeOldValue = shake.shakeValueByFileName[fileName].oldValue;
        // 避免重复发相同的值
        if (shakeValue == shakeOldValue) {
          continue;
        }
        if (shakeValue > 100) {
          shakeValue = 100;
        } else if (shakeValue < 0) {
          shakeValue = 0;
        }
        shakeValue = shakeValue / 100 * 255;
        // log.info(shakeValue);
        for (const motor in AllDevices[pid].DynamicVibrationMotor) {
          const index = AllDevices[pid].DynamicVibrationMotor[motor];
          shake.dll.SetLedStateBySerialNumber(part.serial_number, index, shakeValue)
        }
        shake.shakeValueByFileName[fileName].oldValue = shake.shakeValueByFileName[fileName].value;
      }
    }
  }
}
// 获取设备的零件信息
shake.Part = function (_Part) {
  if (_.isEqual(shake.partByPath, _Part)) {
    return
  }
  shake.partByPath = _Part;
  shake.DevicesAndPart();
}
// 读取设备信息
shake.Devices = function (_Devices) {
  if (_.isEqual(shake.deviceByPath, _Devices)) {
    return
  }
  shake.deviceByPath = _Devices;
  shake.DevicesAndPart();
}
// 将设备和零件信息整合到一起
shake.DevicesAndPart = function () {
  if (_.isEmpty(shake.deviceByPath) || _.isEmpty(shake.partByPath)) {
    return;
  }
  try {
    // 仅保存有振动马达的零件
    shake.partByPid = {};
    for (var path in shake.partByPath) {
      for (var pid in shake.partByPath[path]) {
        var part = shake.partByPath[path][pid];
        if (_.isEmpty(shake.deviceByPath[path])) {
          return;
        }
        // 如果没有振动马达则跳过
        if (AllDevices[pid] && !AllDevices[pid].DynamicVibrationMotor) {
          continue
        }
        part.guid = shake.deviceByPath[path].str_guid_instance;
        part.product_name = shake.deviceByPath[path].product_name;
        // 如果设备配置为空，则设置默认
        if (_.isEmpty(shake.vibrationMotorConfig[pid])) {
          shake.vibrationMotorConfig[pid] = {
            mode: 'default'
          }
        }
        // 给零件追加模式（禁用/默认/高级）
        part.mode = shake.vibrationMotorConfig[pid].mode;
        // 给零件追加名称
        part.name = AllDevices[pid].DisplayName;
        // 筛选有振动马达的零件，供后面使用
        shake.partByPid[pid] = part
      }
    }
    // 重载配置
    shake.reloadConfig();
  } catch (err) {

  }
}
// 读取设备输入(暂时无用)
shake.CB_InputData = function (Data) {}
//* ************************************************************************************** */
//* *************************************定时运行模型************************************************* */
shake.interval = 20;
shake.timestamp = 0;

// 定时处理DCS数据后将震动发给硬件。10ms
shake.beg = () => {
  shake.timestamp = Date.now();
  shake.timer = setInterval(() => {
    var now = Date.now();
    // 更新间接参数的数值
    for (const key in shake.indirectParam) {
      var param = shake.indirectParam[key];
      param.oldValue = param.value
      param.value = param.parseFunc({
        directParam: shake.directParam,
        indirectParam: shake.indirectParam,
        interval: now - shake.timestamp
      });
      var scale = param.scale || 1;
      param.scaleValue = param.value * scale;
      param.scaleOldValue = param.oldValue * scale;
      param.scaleMin = param.min * scale;
      param.scaleMax = param.max * scale;
    }
    // 重新给直接参数的旧值赋值
    for (const key in shake.directParam) {
      var param = shake.directParam[key];
      param.oldValue = param.value
    }
    // 将数据发给计算模型，获取振动数值

    for (const fileName in shake.shakeEffectByFileName) {
      var shakeEffect = shake.shakeEffectByFileName[fileName];
      var shakeValue = 0.0;
      for (const effectKey in shakeEffect) {
        const effect = shakeEffect[effectKey];
        var trigger = true;
        // 条件判断
        for (var condition of effect.detail.paramArray) {
          if (condition.type == 'direct') {
            if (!effect.directParam[condition.paramKey].value) {
              trigger = false;
            }
          } else if (condition.type == 'indirect') {
            if (!effect.indirectParam[condition.paramKey].value) {
              trigger = false;
            }
          }
        }
        if (effect.detail.x) { // 连续模型
          if (!trigger) {
            effect.shakeValue = 0.0;
            continue;
          }
          // 计算振动数值
          var xVal = 0; var cVal = 0;
          if (effect[effect.detail.x.type + 'Param'][effect.detail.x.paramKey].scaleValue == undefined) {
            continue;
          }
          xVal = effect[effect.detail.x.type + 'Param'][effect.detail.x.paramKey].scaleValue || 0;
          cVal = effect.detail.c && effect[effect.detail.c.type + 'Param'][effect.detail.c.paramKey].scaleValue || 0;
          if (xVal < effect.xMin) {
            xVal = effect.xMin;
          }
          if (xVal > effect.xMax) {
            xVal = effect.xMax;
          }
          if (cVal < effect.cMin) {
            cVal = effect.cMin;
          }
          if (cVal > effect.cMax) {
            cVal = effect.cMax;
          }
          effect.shakeValue = shake.dll.ContinuousModelOperatoion(effectKey, xVal, cVal).data;
          // log.info("effect.shakeValue",effect.shakeValue)
        } else { // 触发模型
          if (trigger) {
            effect.lastTriggerTime = now;
          }
          // 计算振动数值
          var duration = (effect.xMax - effect.xMin) * 1000;
          var offset = now - effect.lastTriggerTime;
          if (offset <= duration) {
            var xVal = offset / duration / 1000;
            effect.shakeValue = shake.dll.ContinuousModelOperatoion(effectKey, xVal, 0).data;
            // log.info("xVal"+xVal+",shakeValue"+effect.shakeValue);
          } else {
            effect.shakeValue = 0.0;
            continue;
          }
        }
        shakeValue = shakeValue > effect.shakeValue ? shakeValue : effect.shakeValue;
      }
      shake.shakeValueByFileName[fileName] = shake.shakeValueByFileName[fileName] || { value: 0, oldValue: 0 }
      shake.shakeValueByFileName[fileName].value = shakeValue;
    }
    // 将计算结果发给硬件
    shake.toHardware();
    shake.timestamp = now
  }, shake.interval);// 10ms间隔
}
// 结束定时
shake.end = () => {
  shake.timer && clearInterval(shake.timer);
}
//* ****************************************************************************************************** */
//* **********************************************主线程相关***************************************************** */
// 监听渲染线程
ipcMain.on('WWTHID_VibrationEffect', function (event, arg) {
  // 重载配置
  shake.reloadConfig();
});
// 监听事件：设置振动马达配置（禁用/默认/高级）
ipcMain.on('WWTHID_SetVibrationMotorConfig', (e, arg) => {
  shake.vibrationMotorConfig[arg.key] = arg.val;
  shake.config.set('DevicesDynamicVibrationMotorConfig', shake.vibrationMotorConfig);
  for (var pid in shake.partByPid) {
    var part = shake.partByPid[pid];
    // 给零件追加模式（禁用/默认/高级）
    part.mode = shake.vibrationMotorConfig[pid].mode;
  }
  // 重载配置
  shake.reloadConfig();
});
// 监听事件：获取振动马达配置（禁用/默认/高级）
ipcMain.on('WWTHID_GetVibrationMotorConfig', (e, arg) => {
  var config = shake.vibrationMotorConfig[arg.key];
  if (_.isEmpty(config)) {
    config = {
      mode: 'default'
    }
  }
  e.returnValue = config;
});
//* ********************************************************************************* */
module.exports = shake;
