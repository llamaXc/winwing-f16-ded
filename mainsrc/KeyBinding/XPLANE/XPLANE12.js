/*
 * @Author: lixingguo 
 * @Date: 2024-01-19 16:49:25 
 * @Last Modified by: lixingguo
 * @Last Modified time: 2024-01-19 17:32:13
 */
const FileManager = require('../FileManager.js');
const XPLANE = require('./XPLANE.js');
const _ = require('lodash');

const XPLANE12 = {
    gamePath: '', // 游戏文件路径
    filePath: '', // 游戏files文件路径
    gameConfig: {
        gameId: 'XPLANE12'
    }
}
// 初始化MFD
XPLANE12.init = (dll, store, getPath, win) => {
    // step1: 缓存参数
    XPLANE12.win = win;
    XPLANE12.dll = dll;
    XPLANE12.getPath = getPath;
    XPLANE12.store = store;

    // step2: 初始化XPLANE12文件信息及配置信息
    XPLANE12.initInfo();
}

// 初始化XPLANE12文件信息及配置信息
XPLANE12.initInfo = () => {
    // step1: 初始化（读取）gamePath
    XPLANE12.gamePath = FileManager.getGamePathForSimWithKey(XPLANE12.gameConfig.gameId);
    // step2: 初始化（读取）filePath
    XPLANE12.filePath = FileManager.getGameFilesPathForSim(XPLANE12.gamePath);
    // step3: 初始化（读取）tempPath
    XPLANE12.tempPath = FileManager.getGameTempPathForSim(XPLANE12.filePath);
    // step4：初始化（读取）game_config.json配置文件信息
    XPLANE12.gameConfig = _.merge({}, XPLANE12.gameConfig, FileManager.getGameConfig(XPLANE12.gamePath));
    // step5：初始化游戏安装包路径exePath
    XPLANE12.gameConfig.exePath = XPLANE12.getPath.GetActiveXPLANEEXEPath('XPANE12');
    // step6：初始化游戏安装包路径keyboard、Joystick配置文件路径
    if (XPLANE12.gameConfig.exePath) {
        XPLANE12.gameConfig.keyboardPath = XPLANE12.gameConfig.exePath + "\\Output\\preferences\\X-Plane Keys.prf"
        XPLANE12.gameConfig.JoystickPath = XPLANE12.gameConfig.exePath + "\\Output\\preferences\\X-Plane Joystick Settings.prf"
    } else {
        XPLANE12.gameConfig.keyboardPath = ''
        XPLANE12.gameConfig.JoystickPath = ''
    }
}
// 提取游戏配置文件信息
XPLANE12.extractConfigForGame = (arg) => {
    return XPLANE.extractConfigForXPLANE12(arg.deviceInfo, XPLANE12.filePath, arg.targetpath)
}
// 激活游戏配置文件信息
XPLANE12.activeConfigForGame = (arg) => {
    return XPLANE.activeWindowPositionConfigFilesForXPLANE12(arg.deviceInfo, arg.targetpath)
}

/************************************以上是公有配置和方法***************************************************/

/**----------------------------------------我是万中无一分割线---------------------------------------------**/

/************************************以下是游戏私有方法*****************************************************/
module.exports = XPLANE12;