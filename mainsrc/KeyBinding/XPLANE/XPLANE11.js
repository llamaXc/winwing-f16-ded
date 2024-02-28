/*
 * @Author: lixingguo 
 * @Date: 2024-01-19 16:49:31 
 * @Last Modified by: lixingguo
 * @Last Modified time: 2024-01-19 17:31:19
 */
const FileManager = require('../FileManager.js');
const XPLANE = require('./XPLANE.js');
const _ = require('lodash');

const XPLANE11 = {
    gamePath: '', // 游戏文件路径
    filePath: '', // 游戏files文件路径
    gameConfig: {
        gameId: 'XPLANE11'
    }
}
// 初始化MFD
XPLANE11.init = (dll, store, getPath, win) => {
    // step1: 缓存参数
    XPLANE11.win = win;
    XPLANE11.dll = dll;
    XPLANE11.getPath = getPath;
    XPLANE11.store = store;

    // step2: 初始化XPLANE11文件信息及配置信息
    XPLANE11.initInfo();
}

// 初始化XPLANE11文件信息及配置信息
XPLANE11.initInfo = () => {
    // step1: 初始化（读取）gamePath
    XPLANE11.gamePath = FileManager.getGamePathForSimWithKey(XPLANE11.gameConfig.gameId);
    // step2: 初始化（读取）filePath
    XPLANE11.filePath = FileManager.getGameFilesPathForSim(XPLANE11.gamePath);
    // step3: 初始化（读取）tempPath
    XPLANE11.tempPath = FileManager.getGameTempPathForSim(XPLANE11.filePath);
    // step4：初始化（读取）game_config.json配置文件信息
    XPLANE11.gameConfig = _.merge({}, XPLANE11.gameConfig, FileManager.getGameConfig(XPLANE11.gamePath));
    // step5：初始化游戏安装包路径exePath
    XPLANE11.gameConfig.exePath = XPLANE11.getPath.GetActiveXPLANEEXEPath('XPANE11');
    // step6：初始化游戏安装包路径keyboard、Joystick配置文件路径
    if (XPLANE11.gameConfig.exePath) {
        XPLANE11.gameConfig.keyboardPath = XPLANE11.gameConfig.exePath + "\\Output\\preferences\\X-Plane Keys.prf"
        XPLANE11.gameConfig.JoystickPath = XPLANE11.gameConfig.exePath + "\\Output\\preferences\\X-Plane Joystick Settings.prf"
    } else {
        XPLANE11.gameConfig.keyboardPath = ''
        XPLANE11.gameConfig.JoystickPath = ''
    }
}
// 提取游戏配置文件信息
XPLANE11.extractConfigForGame = (arg) => {
    return XPLANE.extractConfigForXPLANE11(arg.deviceInfo, XPLANE11.filePath, arg.targetpath)
}
// 激活游戏配置文件信息
XPLANE11.activeConfigForGame = (arg) => {
    return XPLANE.activeWindowPositionConfigFilesForXPLANE11(arg.deviceInfo, arg.targetpath)
}

/************************************以上是公有配置和方法***************************************************/

/**----------------------------------------我是万中无一分割线---------------------------------------------**/

/************************************以下是游戏私有方法*****************************************************/
module.exports = XPLANE11;