/*
 * @Author: lixingguo 
 * @Date: 2024-01-19 16:49:19 
 * @Last Modified by: lixingguo
 * @Last Modified time: 2024-01-19 17:52:58
 */
const _ = require('lodash');
const { ipcMain } = require('electron');

// 引入子类
const DCS = require('./DCS/DCS.js');
const P3D = require('./P3D/P3D.js');
const XPLANE11 = require('./XPLANE/XPLANE11.js');
const XPLANE12 = require('./XPLANE/XPLANE12.js');
// 把所有的子类，存储到数组中，用来遍历处理
const KEYBIND_ALL_Config = [DCS, P3D, XPLANE11, XPLANE12];

// 引入FileManager.js文件管理文件
const FileManager = require('./FileManager.js');

// KEYBIND对象
const KEYBIND = {
  keyPath: '', // KeyBinding总文件路径
  filePath: '', // files文件路径
  config: {
    curGameId: 'DCS'
  }, // KEYBIND_config.json配置文件信息
  curGameConfig: {} //当前展示的游戏信息
};
KEYBIND.unpackDir = __dirname.replace('app.asar', 'app.asar.unpacked');

// 初始化GED
KEYBIND.init = (dll, store, getPath, win) => {
  KEYBIND.win = win

  // step1: 初始化KeyBinding文件信息
  KEYBIND.initInfo()

  // step2: 循环初始化子类信息
  for (let i = 0; i < KEYBIND_ALL_Config.length; i++) {
    const Child = KEYBIND_ALL_Config[i];
    Child.init(dll, store, getPath, win)
    if (KEYBIND.config.curGameId === Child.gameConfig.gameId) {
      KEYBIND.curGameConfig = Child.gameConfig
    }
  }

  // step3: 监听SimAppPro隐藏和显示事件
  KEYBIND.win.on('show', KEYBIND.sendAppShow);
  KEYBIND.win.on('hide', KEYBIND.sendAppHide);

  // step4: 发送数据
  KEYBIND.appShowStatus = true;
  KEYBIND.isInit = true;
  if (KEYBIND.uiShowStatus) {
    KEYBIND.sendInit();
  }
};
// 初始化KeyBinding文件信息及配置信息
KEYBIND.initInfo = () => {
  // step1: 初始化（读取）keyPath
  KEYBIND.keyPath = FileManager.getKeyPathForSim();
  // step2: 初始化（读取）filePath
  KEYBIND.filePath = FileManager.getFilePathForSim();
  // step3: 判断并删除filePath（filePath是之前版本用来存放本地按键绑定配置文件的，重构之后将会放到各游戏文件夹下去）
  if (FileManager.deleteDirectory(KEYBIND.filePath)) {
    // 文件夹删除成功，读取文件将从各游戏文件夹下去读取
    KEYBIND.filePath = ''
  }
  // step4：初始化（读取）KEYBIND_config.json配置文件信息
  KEYBIND.config = _.merge({}, KEYBIND.config, FileManager.getConfigForKeyBinding());
}
// 发送数据
KEYBIND.sendInit = () => {
  // step1: 发送config
  KEYBIND.sendConfig()
  // step2: 发送游戏配置
  KEYBIND.sendCurGameConfig()
}
// 写入配置文件
KEYBIND.setConfig = () => {
  FileManager.setConfigForKeyBinding(KEYBIND.config)
}
// 游戏切换
KEYBIND.ChangeGameWithGameId = (gameId) => {
  // step1: 如果设备id不变，不做处理
  if (KEYBIND.config.curGameId !== gameId) {
    // step2: 值替换
    KEYBIND.config.curGameId = gameId
    // step3: 写入配置文件
    KEYBIND.setConfig()
    // step4: 将配置发给渲染线程
    KEYBIND.sendConfig();
    // step5: 获取游戏配置信息
    const Child = KEYBIND_ALL_Config.find((val) => val.gameConfig.gameId === gameId)
    KEYBIND.curGameConfig = Child.gameConfig
    // setp6: 将游戏配置发给渲染线程
    KEYBIND.sendCurGameConfig();
  }
}

/************************sendEvent事件发送集合************************************/
// 事件发送
KEYBIND.sendEvent = (event, arg) => {
  KEYBIND.win && KEYBIND.win.webContents.send('KEYBIND-' + event, arg)
}
// 通知配置变更
KEYBIND.sendConfig = () => {
  KEYBIND.sendEvent('config', KEYBIND.config);
}
// 通知游戏配置变更
KEYBIND.sendCurGameConfig = () => {
  KEYBIND.sendEvent('gameConfig', KEYBIND.curGameConfig);
}
// 发送SimAppPro显示事件
KEYBIND.sendAppShow = () => {
  KEYBIND.appShowStatus = true;
  KEYBIND.sendEvent('app-show');
};

// 发送SimAppPro隐藏事件
KEYBIND.sendAppHide = () => {
  KEYBIND.appShowStatus = false;
  KEYBIND.sendEvent('app-hide');
};
/************************ipcMain监听方法集合************************************/
// 界面渲染
ipcMain.on('KeyBinding_Mounted', (e, arg) => {
  KEYBIND.uiShowStatus = true
  if (KEYBIND.isInit) {
    KEYBIND.sendConfig();
    KEYBIND.sendCurGameConfig();
  }
})
// 界面销毁
ipcMain.on('KeyBinding_Destroyed', (e, arg) => {
  KEYBIND.uiShowStatus = false
})
// 游戏切换
ipcMain.on('KeyBinding_ChangGame', (e, arg) => {
  KEYBIND.ChangeGameWithGameId(arg)
})
// 提取游戏配置文件
ipcMain.on('KeyBinding_ExtractConfig', (e, arg) => {
  const Child = KEYBIND_ALL_Config.find((val) => val.gameConfig.gameId === KEYBIND.curGameConfig.gameId)
  const extractResult = Child.extractConfigForGame(arg)
  KEYBIND.sendEvent('extractResult', extractResult)
})
// 激活游戏配置文件
ipcMain.on('KeyBinding_ActiveConfig', (e, arg) => {
  const Child = KEYBIND_ALL_Config.find((val) => val.gameConfig.gameId === KEYBIND.curGameConfig.gameId)
  const activeResult = Child.activeConfigForGame(arg)
  KEYBIND.sendEvent('activeResult', activeResult)
})
module.exports = KEYBIND;
