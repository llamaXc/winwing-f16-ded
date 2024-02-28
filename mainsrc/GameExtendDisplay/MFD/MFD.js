const path = require('path');
const _ = require('lodash');
const { ipcMain } = require('electron');
const TransparentDisplayTag = require('../../TransparentDisplayTag.js');
const { Notification } = require('electron');
const notifierIcon = path.join(__dirname, '../../../www/logo', 'SimAppPro.png');

// 创建、存储、读取文件工具
const game_config_set = require('../game_config_set.js');

// MFD设备主线处理逻辑需要用到的子文件
const DCS = require('./DCS/DCS.js');
const BMS = require('./BMS/BMS.js');
const MFD_DisplayDriver = require('./MFD_DisplayDriver.js');
const MFD_DisplayMode = require('./MFD_DisplayMode.js');
const MFD_GameDisplay = require('./MFD_GameDisplay.js');
const MFD_DisplayLayout = require('./MFD_DisplayLayout.js');
const MFD_DisplaySetting = require('./MFD_DisplaySetting.js');
const MFD_DisplayStatus = require('./MFD_DisplayStatus.js');
// 把所有的子文件，存储到文件数组中，用来遍历处理
const MFD_ALL_Config = [DCS, BMS];

// MFD对象
const MFD = {};
MFD.interval = 3000;

// 需要用到的临时配置信息（如驱动路径，界面展示图片存储路径）
MFD.imgBase = path.join(__dirname, '/../../../www/LoadImages/MFD/');
MFD.unpackDir = __dirname.replace('app.asar', 'app.asar.unpacked');
MFD.imgLeaderLineBase = path.join(MFD.unpackDir, '/../../../Events/MFD/img/');

// 初始化检查单数据（这里是MFD设备检查单，各游戏检查单已下放到游戏配置里）
const checkDefault = {
  parent: '',
  show: true,
  status: '', // process,warning,error,success
  description: '',
  tag: ''
};
MFD.checkObjectDefault = {
  // MFD_CheckList页面展示的“检查MFD显示器驱动”
  mfdDriver: {
    ...checkDefault
  },
  // MFD_DisplayDriver界面展示的“检查MFD显示器驱动是否下载”
  mfdDriverDownload: {
    ...checkDefault,
    parent: 'mfdDriver'
  },
  // MFD_DisplayDriver界面展示的“检查MFD显示器驱动是否安装”
  mfdDriverInstall: {
    ...checkDefault,
    parent: 'mfdDriver'
  },
  // MFD_CheckList页面展示的“检查Windows显示模式”
  extendMode: {
    ...checkDefault
  }
};
// 初始化MFD
MFD.init = (dll, store, getPath, win) => {
  // A1:缓存参数
  MFD.win = win;
  MFD.dll = dll;
  MFD.getPath = getPath;
  MFD.store = store;

  // A2:初始化MFD的数据存储路径(用来存放MFD及各自游戏缓存配置文件信息)
  MFD.userPath = game_config_set.getFilePathWithKey('MFD');

  // A3:监听SimAppPro隐藏和显示事件
  MFD.win.on('show', MFD.sendAppShow);
  MFD.win.on('hide', MFD.sendAppHide);

  // A4:初始化MFD配置信息
  const defaultConfig = require(path.join(MFD.unpackDir, '/../../../config/GameExtendDisplay/MFD/MFD.js'));
  MFD.defaultConfig = defaultConfig.config;
  MFD.getConfig();

  // A5:初始化所有的子文件路径及信息
  MFD.initAllFillPathAndInfo(MFD.getPath);

  // A6:获取当前界面展示的游戏配置信息,并下发给界面
  MFD.getCurGameConfig();
  MFD.sendCurGameConfig();

  // A7:判断是否下载了MFD驱动
  MFD_DisplayDriver.getDisplayLinkInfo(MFD.store);

  // A8:打开C++库（显示器接口）
  MFD.dll.Monitor_Open();

  // A9:监听显示器变化(需要下发到各自游戏去处理)
  MFD.dll.Monitor_CB_MonitorChange((arg) => {
    MFD.monitorChange(arg);
  });

  // A10:开始执行检查逻辑（下发到子文件处理）
  MFD.startCheckout();

  MFD.appShowStatus = true;
  MFD.isInit = true;
  if (MFD.uiShowStatus) {
    MFD.sendInit();
  }
};
// 开始检查
MFD.startCheckout = () => {
  // 检查各游戏显示器布局与方向(是否需要重置显示器)
  if (MFD.config.monitorLayoutReset) {
    MFD.monitorLayoutCheckout();
  }
  // 循环检查
  MFD.intervalCheckout();
};
// 检查显示器布局与方向
MFD.monitorLayoutCheckout = () => {
  // A3：循环判断，直到显示器数据刷新，并重置一次显示器位置和方向后退出。
  var timer = setInterval(() => {
    // B1:如果显示器为空，则继续循环,等待显示器数据更新
    if (_.isEmpty(MFD.monitorInfoById)) {
      return
    }
    // B2:清除循环，执行完本次逻辑
    clearInterval(timer);
    // B3:检查显示器数量和ID是否一一匹配
    var monitorIdArray = [];
    var configMonitorIdArray = [];
    var monitoInfoArray = [];
    for (const id in MFD.monitorInfoById) {
      monitorIdArray.push(id);
    }
    for (const id in MFD.config.lastUsedMonitorInfoById) {
      configMonitorIdArray.push(id);
      monitoInfoArray.push(MFD.config.lastUsedMonitorInfoById[id]);
    }
    const monitorIdXor = _.xor(monitorIdArray, configMonitorIdArray);
    if (!_.isEmpty(monitorIdXor)) {
      // C1:如果显示器数量和ID不匹配，则放弃重置显示器位置和方向
      return;
    }
    // B4:如果显示器数量和ID匹配，则重置显示器位置和方向。
    MFD.dll.Monitor_SetMonitor(monitoInfoArray);
  }, 2000);
};
// 校验MFD显示器
MFD.intervalCheckout = () => {
  MFD.clearIntervalCheckout();
  const interval = () => {
    const isCheckPass = MFD.MFDCheckObjectCheckout();

    if (JSON.stringify(MFD.checkObject) !== JSON.stringify(MFD.checkObjectOld)) {
      MFD.sendCheckObject(MFD.checkObject);
      if (!isCheckPass) {
        MFD.notify();
      }
    }
    MFD.checkObjectOld = _.cloneDeep(MFD.checkObject);

    // MFD检查单通过，遍历开启各自游戏检查单
    for (let i = 0; i < MFD_ALL_Config.length; i++) {
      const Child = MFD_ALL_Config[i];
      // 初始化检查单
      Child.checkObject = _.merge({}, MFD.checkObject, Child.checkObjectDefault);
      if (isCheckPass) {
        const isCheckPass_child = MFD.ChildCheckObjectCheckout(Child);
        if (JSON.stringify(Child.checkObject) !== JSON.stringify(Child.checkObjectOld)) {
          MFD.sendCheckObject(Child.checkObject);
          if (!isCheckPass_child) {
            MFD.notify();
          }
        }
      } else {
        // 当主检查单检查出问题的时候，子检查单需要还原成默认值
        if (JSON.stringify(Child.checkObject) !== JSON.stringify(Child.checkObjectOld)) {
          MFD.sendCheckObject(Child.checkObject);
        }
      }
      Child.checkObjectOld = _.cloneDeep(Child.checkObject);
    }
  };
  interval();
  MFD.timer = setInterval(() => {
    interval();
  }, MFD.interval);
};
// 清除检查定时器
MFD.clearIntervalCheckout = () => {
  if (MFD.timer) {
    clearInterval(MFD.timer);
    MFD.timer = undefined;
  }
};
// 检测MFD检查单
MFD.MFDCheckObjectCheckout = () => {
  // A1:初始化检查单
  MFD.checkObject = _.merge({}, MFD.checkObjectDefault);
  var ret;
  // A2:校验是否下载驱动，安装驱动
  var checkResult = MFD_DisplayDriver.checkoutDriver(MFD.dll, MFD.checkObject);
  MFD.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  }

  // A3:校验是否为扩展模式
  checkResult = MFD_DisplayMode.checkoutMode(MFD.monitorInfoById, MFD.checkObject);
  MFD.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  }

  // A4:判断屏幕信息是否已获取
  if (_.isEmpty(MFD.monitorInfoById)) {
    return false;
  }

  return true
};
// 检测各自游戏检查单
MFD.ChildCheckObjectCheckout = (Child) => {
  var ret;

  // B1:校验游戏是否在运行(同步游戏运行状态)
  var runningStatus = MFD.dll.CheckProcessExists(Child.gameConfig.gameRunningKey);
  if (Child.gameConfig.gameRunningStatus !== runningStatus) {
    Child.gameConfig.gameRunningStatus = runningStatus
    Child.gameRunningStatusChange = true
    // 游戏运行状态发生变化，发出通知
    if (Child.gameConfig.gameId === MFD.curGameConfig.gameId) {
      MFD.sendCurGameConfig()
    }
    // 游戏运行状态发生变化，修改显示和隐藏也要
    if (runningStatus) {
      MFD.closeIdentifyId();
    } else {
      MFD.openIdentifyId();
    }
  }

  // B2:校验游戏路径及相关配置文件信息
  var checkResult = Child.checkoutPath(Child.checkObject);
  Child.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  }

  // B3:校验游戏画面显示器
  checkResult = MFD_GameDisplay.checkoutMainMonitor(Child.gameConfig, MFD.monitorInfoById, Child.checkObject);
  Child.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  }

  // B4:校验各子模块独有的应用配置信息
  checkResult = Child.checkOwnerConfigInfo(Child.checkObject);
  Child.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  }

  // B5:校验屏幕排布和方向
  checkResult = MFD_DisplayLayout.checkoutMonitor(Child.gameConfig, MFD.monitorInfoById, Child.checkObject);
  Child.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  }

  // B6:校验屏幕是否变更
  checkResult = MFD_DisplaySetting.checkoutMfdSetting(Child.gameConfig, MFD.monitorInfoById, Child.checkObject, MFD.monitorChange);
  Child.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  }

  // B7:校验游戏配置是否变更
  checkResult = Child.checkoutGameInfoChange(Child.checkObject, MFD.templatePath);
  Child.checkObject = checkResult.checkObject;
  ret = checkResult.result;
  if (!ret) {
    return false;
  } else {
    // 由于检查单是循环检查，所以这里也会循环多次进行
    if (Child.gameRunningStatusChange) {
      Child.gameRunningStatusChange = false
      // 所有检查都通过，检测游戏是否运行。如果处于运行状态，开启(关闭)子类游戏运行需要进行的设置
      Child.gameRuningSetting(runningStatus, MFD.dll)
    }
  }

  // B8:校验游戏运行时显示器状态
  checkResult = MFD_DisplayStatus.checkoutMonitorStatusWhenGameRunning(Child.gameConfig, Child.checkObject, MFD.monitorInfoById);
  Child.checkObject = checkResult.checkObject;
  ret = checkResult.result;

  if (!ret) {
    return false;
  }

  return true;
};

// 发送SimAppPro显示事件
MFD.sendAppShow = () => {
  MFD.appShowStatus = true;
  MFD.sendEvent('mfd-app-show');
};

// 发送SimAppPro隐藏事件
MFD.sendAppHide = () => {
  MFD.appShowStatus = false;
  MFD.sendEvent('mfd-app-hide');
};

// 获取文件路径,初始化各自游戏的配置信息
MFD.initAllFillPathAndInfo = (getPath) => {
  // 初始化MFD_DisplayDriver的Driver存储路径
  MFD_DisplayDriver.driverDir = path.join(MFD.userPath, 'Driver');
  // 创建Driver存储路径文件夹
  game_config_set.creatFilePath(MFD_DisplayDriver.driverDir);
  // MFD配置文件路径及wwtMonitor.lua文件路径
  MFD.MainPath = getPath.GetMainPath();
  if (MFD.MainPath) {
    MFD.templatePath = path.join(MFD.MainPath, 'config\\GameExtendDisplay\\MFD\\wwtMonitor.lua');
  }
  // 遍历循环所有的游戏，初始化各自配置文件路径及信息
  for (let i = 0; i < MFD_ALL_Config.length; i++) {
    const Child = MFD_ALL_Config[i]
    Child.getChildFilePath(getPath)
    const defaultConfig = require(path.join(MFD.unpackDir, '/../../../config/GameExtendDisplay/MFD/' + Child.gameKey + '/' + Child.gameKey + '.js'));
    const fileConfig = game_config_set.getConfigWithKey(Child.gameKey, MFD.userPath);
    const extraConfig = require(path.join(MFD.unpackDir, '/../../../config/GameExtendDisplay/MFD/' + Child.gameKey + '/' + Child.gameKey + '_extra.js'));
    Child.extraConfig = extraConfig.config;
    Child.gameConfig = _.merge({}, defaultConfig.config, fileConfig, extraConfig.config);
  }
}
// 监听屏幕信息变化
MFD.monitorChange = (argArray) => {
  // A1:缓存参数,避免因VR出现重复ID
  const idArray = [];
  MFD.monitorInfo = [];
  for (const arg of argArray) {
    if (idArray.includes(arg.id) || arg.width === 0 || arg.height === 0) {
      continue;
    }
    MFD.monitorInfo.push(arg);
    idArray.push(arg.id)
  }
  // A2:将数组转为对象，方便查询
  MFD.getMonitorInfoById();
  // A3:通知渲染进程屏幕变更
  MFD.sendMonitorChange();
}
// 获取配置文件
MFD.getConfig = () => {
  // A3:获取本地MFD配置文件信息
  const fileConfig = game_config_set.getConfigWithKey('MFD', MFD.userPath);
  // A4:组装MFD配置信息
  MFD.config = _.merge({}, MFD.defaultConfig, fileConfig);
  // 将配置发给渲染线程
  MFD.sendConfig();
}
// 获取当前界面展示的游戏配置信息
MFD.getCurGameConfig = () => {
  var hasChild
  for (let i = 0; i < MFD_ALL_Config.length; i++) {
    const Child = MFD_ALL_Config[i];
    if (MFD.config.curGameId === Child.gameConfig.gameId) {
      MFD.curGameConfig = Child.gameConfig
      // 更新图标
      MFD.updateIcon(Child);
      hasChild = true
      break
    }
  }
  // 当屏蔽掉某款游戏的时候，需要重置curGameConfig信息
  if (!hasChild) {
    const Child = MFD_ALL_Config[0];
    MFD.curGameConfig = Child.gameConfig
    // 更新图标
    MFD.updateIcon(Child);
    hasChild = true
  }
}
// 切换游戏
MFD.ChangeGameWithGameId = (gameId) => {
  // 如果游戏id不变，不做处理
  if (MFD.config.curGameId !== gameId) {
    MFD.config.curGameId = gameId
    // 获取游戏配置信息
    MFD.getCurGameConfig()
    // 将配置发给渲染线程
    MFD.setConfig()
    MFD.sendConfig();
    // 将游戏配置发给渲染线程
    MFD.sendCurGameConfig();
    // 切换游戏的时候，检查单也得跟着切换成对应游戏得检查单
    MFD.sendCurCheckObject();
  }
}
// 切换飞机模型
MFD.ChangeModWithModId = (modId) => {
  // 如果游戏id不变，不做处理
  if (MFD.curGameConfig.currentMod !== modId) {
    MFD.curGameConfig.currentMod = modId
    MFD.setCurGameConfig()
  }
}
// 设置配置文件
MFD.setConfig = () => {
  game_config_set.setConfigWithKey('MFD', MFD.userPath, MFD.config)
  MFD.sendConfig();
}
// 设置当前界面展示游戏配置文件
MFD.setCurGameConfig = () => {
  game_config_set.setConfigWithKey(MFD.curGameConfig.gameId, MFD.userPath, MFD.curGameConfig)
  for (let i = 0; i < MFD_ALL_Config.length; i++) {
    const Child = MFD_ALL_Config[i];
    if (Child.gameConfig.gameId === MFD.curGameConfig.gameId) {
      Child.gameConfig = MFD.curGameConfig
      break
    }
  }
  // 将游戏配置发给渲染线程
  MFD.sendCurGameConfig()
}
MFD.sendCurCheckObject = () => {
  // 发送检查单
  for (let i = 0; i < MFD_ALL_Config.length; i++) {
    const Child = MFD_ALL_Config[i];
    if (Child.gameConfig.gameId === MFD.curGameConfig.gameId) {
      MFD.sendCheckObject(Child.checkObject);
      break
    }
  }
}
// 获取显示器id
MFD.getMonitorInfoById = () => {
  const monitorInfoById = {};
  for (const info of MFD.monitorInfo) {
    monitorInfoById[info.id] = info;
  }
  MFD.monitorInfoById = monitorInfoById;
}
// 获取飞机模型mod
MFD.getMod = () => {
  const mod = MFD.curGameConfig.gameRunningStatus ? MFD.curGameConfig.applyMod : MFD.curGameConfig.currentMod;
  return mod || '';
}
// 更新图标
MFD.updateIcon = (Child) => {
  if (_.isEmpty(MFD.curGameConfig)) {
    return
  }
  for (const mod in MFD.curGameConfig.modsInfo) {
    try {
      const modInfo = MFD.curGameConfig.modsInfo[mod];
      const extraModInfo = Child.extraConfig.modsInfo[mod];
      modInfo.iconPath = path.join(Child.gameExePath, extraModInfo.iconPath);
      modInfo.iconActivePath = path.join(Child.gameExePath, extraModInfo.iconActivePath);
      modInfo.iconBuyPath = path.join(Child.gameExePath, extraModInfo.iconBuyPath);
      modInfo.cockpitImgPath = path.join(MFD.imgBase, extraModInfo.cockpitImgPath);
    } catch (error) { }
  }
}
// 更新检查单状态
MFD.refreshApplyStatus = (applyName) => {
  const tempArry = MFD.curGameConfig.applyStatusArray;
  let status = 1;
  for (const applyStatus of tempArry) {
    MFD.curGameConfig[applyStatus] = status;
    if (applyName === applyStatus) {
      status = 0;
    }
  }
}
// 校验=================================================================================End
// 独立功能=============================================================================Beg
// 打开笼罩层
MFD.openOverlayer = () => {
  // A1:跳过
  if (_.isEmpty(MFD.config) || _.isEmpty(MFD.curGameConfig.currentMod)) {
    return
  }
  // A2:移除旧笼罩层
  if (!_.isEmpty(MFD.tagsOfOverlayerByInstrumentKey) || !_.isEmpty(MFD.tagsOfLeaderLineByInstrumentKey)) {
    MFD.closeOverlayer();
  }
  // 重新计算屏幕
  const { curGameConfig } = MFD_DisplaySetting.calcAllMonitor(MFD.curGameConfig, MFD.monitorInfoById);
  MFD.curGameConfig = curGameConfig
  // A3:新增笼罩层
  MFD.tagsOfOverlayerByInstrumentKey = {};
  MFD.tagsOfLeaderLineByInstrumentKey = {};
  const mod = MFD.curGameConfig.currentMod;
  if (mod === '') {
    return
  }
  const instruments = MFD.curGameConfig.modsInfo[mod].instruments;
  if (_.isEmpty(instruments)) {
    return
  }
  for (const instrumentKey in instruments) {
    const instrument = instruments[instrumentKey];
    if (_.isEmpty(instrument.id)) {
      continue;
    }
    if (!_.isEmpty(instrument.overlayerBackColor) || (instrument.isEnableKeyGuide && !_.isEmpty(instrument.overlayerBackImg))) {
      const tag = new TransparentDisplayTag(true);
      const left = instrument.displayMonitor.left + instrument.overlayerTailorMonitor.left;
      const top = instrument.displayMonitor.top + instrument.overlayerTailorMonitor.top;
      const right = instrument.displayMonitor.right + instrument.overlayerTailorMonitor.right;
      const bottom = instrument.displayMonitor.bottom + instrument.overlayerTailorMonitor.bottom;
      const x = left;
      const y = top;
      const w = right - left;
      const h = bottom - top;
      tag.createWindow(x, y, w, h, !MFD.config.isDebug);
      MFD.tagsOfOverlayerByInstrumentKey[instrumentKey] = tag;
    }
    if (!_.isEmpty(instrument.overlayerBackColor)) {
      const style = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: instrument.overlayerOpacity,
        'background-color': instrument.overlayerBackColor
      }
      MFD.tagsOfOverlayerByInstrumentKey[instrumentKey].setStyleOfDiv('greenScreen', style);
    }
    // A5:设置背景图
    if (instrument.isEnableKeyGuide && !_.isEmpty(instrument.overlayerBackImg)) {
      // A5:设置背景图
      var backImg = path.join(MFD.imgLeaderLineBase, instrument.overlayerBackImg).replace(/\\/g, '////');
      const style = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        'background-image': `url(${backImg})`
      }
      MFD.tagsOfOverlayerByInstrumentKey[instrumentKey].setStyleOfDiv('leaderLine', style);
    }
  }
}
// 更新笼罩层
MFD.updateOverlayer = (instrumentKey, opacity) => {
  const mod = MFD.curGameConfig.currentMod;
  if (mod === '') {
    return
  }

  // 保存透明度
  const instrument = MFD.curGameConfig.modsInfo[mod].instruments[instrumentKey];
  instrument.overlayerOpacity = opacity;

  // 设置透明度
  if (MFD.tagsOfOverlayerByInstrumentKey[instrumentKey]) {
    MFD.tagsOfOverlayerByInstrumentKey[instrumentKey].setPropertyOfStyleOfDiv('greenScreen', 'opacity', opacity);
  }
}
// 更新按键指引
MFD.updateIsEnableKeyGuide = (instrumentKey, isEnableKeyGuide) => {
  // 设置使能状态
  MFD.curGameConfig.modsInfo[MFD.curGameConfig.currentMod].instruments[instrumentKey].isEnableKeyGuide = isEnableKeyGuide;
  MFD.setCurGameConfig()
  // 重启笼罩层
  MFD.openOverlayer();
}
// 关闭笼罩层
MFD.closeOverlayer = () => {
  // 绿幕
  if (!_.isEmpty(MFD.tagsOfOverlayerByInstrumentKey)) {
    for (const instrumentKey in MFD.tagsOfOverlayerByInstrumentKey) {
      const tag = MFD.tagsOfOverlayerByInstrumentKey[instrumentKey];
      tag.closeWindow();
    }
    delete MFD.tagsOfOverlayerByInstrumentKey;
  }
}
// 打开标识ID
MFD.openIdentifyId = () => {
  // 如果窗口关闭或当前游戏运行时,则关闭标识ID
  if (MFD.curGameConfig.gameRunningStatus || !MFD.appShowStatus || !MFD.uiShowStatus) {
    MFD.closeIdentifyId();
    return
  }
  // 关闭旧的标识后重新打开
  if (!_.isEmpty(MFD.tags)) {
    MFD.closeIdentifyId();
  }
  MFD.tags = [];
  for (const id in MFD.monitorInfoById) {
    const info = MFD.monitorInfoById[id];
    const tag = new TransparentDisplayTag();
    const x = info.right - 255;
    const y = (info.top + info.bottom) / 2;
    tag.createWindow(x, y, 200, 80, !MFD.config.isDebug);
    const content = 'ID:' + info.id;
    tag.setContent(content);
    tag.setBackColor('#000000');
    MFD.tags.push(tag);
  }
}
// 关闭标识ID
MFD.closeIdentifyId = () => {
  for (const tag of MFD.tags || []) {
    tag.closeWindow();
  }
  MFD.tags = [];
}
// 独立功能=============================================================================End
// 通知渲染进程==========================================================================Beg
// 打开通知窗口
MFD.notify = () => {
  if (MFD.uiShowStatus || !MFD.dll.IsInstallDisplayLink()) {
    return
  }
  const local = MFD.store.get('Language');
  const title = local !== 'cn' ? 'MFD Display Warning' : 'MFD显示器警告';
  const body = local !== 'cn' ? 'Click to MFD Display to view more' : '点击查看更多信息';

  const notifier = new Notification({
    title,
    body,
    sound: true,
    icon: notifierIcon
  })
  notifier.on('click', (e, arg) => {
    MFD.win.show();
    MFD.switchToMFDDsiplayTab();
  })
  notifier.show();
}
MFD.sendEvent = (event, arg) => {
  MFD.win && MFD.win.webContents.send('GED-' + event, arg)
}
// 通知切换到MFD选项卡
MFD.switchToMFDDsiplayTab = () => {
  MFD.sendEvent('home-switch-tab', 'GAMEEXTENDDISPLAY');
}
// 通知配置变更
MFD.sendConfig = () => {
  MFD.sendEvent('mfd-config', MFD.config);
}
// 通知游戏配置变更
MFD.sendCurGameConfig = () => {
  MFD.sendEvent('mfd-curGameConfig', MFD.curGameConfig);
}
// 通知发送检查单
MFD.sendCheckObject = (checkObject) => {
  MFD.sendEvent('mfd-check-object', checkObject);
}
// 发送屏幕变化事件
MFD.sendMonitorChange = () => {
  MFD.sendEvent('mfd-monitor-change', MFD.monitorInfo);
}
// 发送初始化
MFD.sendInit = () => {
  // 重新获取配置
  MFD.getConfig();
  // 获取游戏配置信息并下发检查单
  MFD.getCurGameConfig();
  MFD.sendCurGameConfig();
  MFD.sendCurCheckObject();
  // 发送屏幕信息
  MFD.sendMonitorChange();
  // 打开标识
  MFD.openIdentifyId();
  // 打开笼罩层
  MFD.openOverlayer();
}
// 发送下载驱动进度
MFD.sendDownloadDriverProgress = () => {
  MFD.sendEvent('GED-mfd-driver-download-info', MFD.DriverDownloadInfo);
}
// 通知渲染进程==========================================================================End
// 让渲染进程调用========================================================================Beg
ipcMain.on('GameExtendDisplay_Mounted', (e, arg) => {
  // MFD的界面状态
  MFD.uiShowStatus = true;
  if (MFD.isInit) {
    MFD.sendInit()
  }
})
ipcMain.on('GameExtendDisplay_Destroyed', (e, arg) => {
  // MFD的界面状态
  MFD.uiShowStatus = false;
  MFD.closeIdentifyId();
})
ipcMain.on('GameExtendDisplay_ChangGame', (e, arg) => {
  MFD.ChangeGameWithGameId(arg)
})
ipcMain.on('GameExtendDisplay_ChangeMod', (e, arg) => {
  MFD.ChangeModWithModId(arg)
})
ipcMain.on('GameExtendDisplay_DownloadDriver', (e, arg) => {
  MFD_DisplayDriver.downloadDisplayLink(MFD.store, MFD.win);
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
// 安装MFD驱动
ipcMain.on('GameExtendDisplay_InstallDriver', (e, arg) => {
  MFD_DisplayDriver.installDriver()
})
// 打开windows扩展投影（这里有问题，打不开）
ipcMain.on('GameExtendDisplay_OpenDisplaySwitch', (e, arg) => {
  MFD_DisplayMode.DisplaySwitch()
})
// 打开windows桌面设置
ipcMain.on('GameExtendDisplay_OpenDeskCpl', (e, arg) => {
  MFD_DisplayLayout.openDeskCpl()
})
ipcMain.on('GameExtendDisplay_SetOverlayerOpacity', (e, arg) => {
  MFD.updateOverlayer(arg.instrument, arg.opacity);
})
// 更新显示器设备可选状态
ipcMain.on('GameExtendDisplay_SetIsEnableKeyGuide', (e, arg) => {
  MFD.updateIsEnableKeyGuide(arg.instrument, arg.isEnableKeyGuide);
})
ipcMain.on('GameExtendDisplay_SetConfig', (e, arg) => {
  MFD.config = arg;
  MFD.setConfig();
  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
// 前台界面，手动调用配置刷新(比如切换飞机模型、切换摄像头、切换MFD显示器配置等)
ipcMain.on('GameExtendDisplay_SetCurGameConfig', (e, arg) => {
  MFD.curGameConfig = arg;
  MFD.setCurGameConfig();

  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
// 手动切换点击检查项
ipcMain.on('GameExtendDisplay_SetCurCheckStepActive', (e, arg) => {
  if (MFD.curGameConfig && MFD.curGameConfig.stepActive !== arg) {
    MFD.curGameConfig.stepActive = arg;
    MFD.setCurGameConfig()
  }
})
// 打开标识id的通知
ipcMain.on('GameExtendDisplay_OpenIdentify', (e, arg) => {
  MFD.openIdentifyId();
})
// 关闭标识id的通知
ipcMain.on('GameExtendDisplay_CloseIdentify', (e, arg) => {
  MFD.closeIdentifyId();
})
// 打开遮罩层的通知
ipcMain.on('GameExtendDisplay_OpenOverlayer', (e, arg) => {
  MFD.openOverlayer();
})
// 关闭遮罩层的通知
ipcMain.on('GameExtendDisplay_CloseOverlayer', (e, arg) => {
  MFD.closeOverlayer();
})
// 游戏画面设置，点击“应用”处理逻辑
ipcMain.on('GameExtendDisplay_MainMonitorApply', (e, arg) => {
  // 应用游戏画面显示器(A1:获取已绑定的游戏画面, A2:未变更则跳过, A3:保存已绑定的屏幕信息)
  MFD.curGameConfig = MFD_GameDisplay.mainMonitorApply(MFD.curGameConfig, MFD.monitorInfoById);
  // A4:设置"应用"状态
  MFD.refreshApplyStatus('mainMonitorApplyStatus');
  // A5:重新计算屏幕数据
  const { curGameConfig } = MFD_DisplaySetting.calcAllMonitor(MFD.curGameConfig, MFD.monitorInfoById);
  MFD.curGameConfig = curGameConfig
  // A6:更新curGameConfig信息
  MFD.setCurGameConfig();

  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
// DCS游戏设置摄像头，点击“应用”处理逻辑
ipcMain.on('GameExtendDisplay_DcsCameraModeApply', (e, arg) => {
  // A1:保存摄像头模式
  MFD.curGameConfig.dcsCameraModeApply = MFD.curGameConfig.dcsCameraMode;
  // A2:设置"应用"状态
  MFD.refreshApplyStatus('dcsCameraModeApplyStatus');
  // A3:更新curGameConfig信息
  MFD.setCurGameConfig();

  // A4:主动调用一次循环检查
  MFD.intervalCheckout();
})
// BMS游戏设置视角，点击“应用”处理逻辑
ipcMain.on('GameExtendDisplay_BmsFovModeApply', (e, arg) => {
  // A1:保存摄像头模式
  MFD.curGameConfig.bmsFovMode = arg.bmsFovMode;
  MFD.curGameConfig.bmsFovNum = arg.bmsFovNum;
  // A2:设置"应用"状态
  MFD.refreshApplyStatus('bmsFovModeApplyStatus');
  // A3:更新curGameConfig信息
  MFD.setCurGameConfig();
  // BMS修改配置Fov文件信息
  const Child = MFD_ALL_Config.find((val) => val.gameKey === 'BMS')
  Child.resetConfigForFov()

  // A4:主动调用一次循环检查
  MFD.intervalCheckout();
})
// 屏幕排布与重置
ipcMain.on('GameExtendDisplay_LayoutReset', (e, arg) => {
  MFD.config.monitorLayoutReset = arg
  MFD.setConfig();
})
// 屏幕排布与方向点击“应用”处理逻辑
ipcMain.on('GameExtendDisplay_MonitorLayoutApply', (e, arg) => {
  // A1:配置显示器id信息
  MFD.curGameConfig = MFD_DisplayLayout.monitorLayoutApply(MFD.curGameConfig, MFD.monitorInfoById);
  // A2:设置"应用"状态
  MFD.refreshApplyStatus('monitorLayoutApplyStatus');
  // A3:重新计算屏幕数据
  const { curGameConfig } = MFD_DisplaySetting.calcAllMonitor(MFD.curGameConfig, MFD.monitorInfoById);
  MFD.curGameConfig = curGameConfig
  // A4：保存显示器排布信息
  MFD.config.lastUsedMonitorInfoById = _.cloneDeep(MFD.monitorInfoById);
  // A5:更新config和curGameConfig信息
  MFD.setConfig();
  MFD.setCurGameConfig();
  // A6:更新各游戏配置文件信息
  const Child = MFD_ALL_Config.find((val) => val.gameKey === curGameConfig.gameId);
  Child.setGameConfig(MFD.curGameConfig, MFD.templatePath);

  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
// MFD配置，点击“应用”，逻辑处理
ipcMain.on('GameExtendDisplay_MfdSettingApply', (e, arg) => {
  // A1:配置applyMod
  MFD.curGameConfig.applyMod = MFD.curGameConfig.currentMod
  // A2:重新计算屏幕数据
  const { curGameConfig } = MFD_DisplaySetting.calcAllMonitor(MFD.curGameConfig, MFD.monitorInfoById);
  MFD.curGameConfig = curGameConfig
  // A3:设置"应用"状态
  MFD.refreshApplyStatus('mfdSettingApplyStatus');
  // A4:更新curGameConfig信息
  MFD.setCurGameConfig();
  // A5:更新各游戏配置文件信息
  const Child = MFD_ALL_Config.find((val) => val.gameKey === curGameConfig.gameId);
  Child.setGameConfig(MFD.curGameConfig, MFD.templatePath);

  // 主动调用一次循环检查
  MFD.intervalCheckout();
})
module.exports = MFD;
