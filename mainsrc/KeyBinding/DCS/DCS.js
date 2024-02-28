/*
 * @Author: lixingguo 
 * @Date: 2024-01-19 16:49:41 
 * @Last Modified by: lixingguo
 * @Last Modified time: 2024-01-19 17:18:57
 */
const FileManager = require('../FileManager.js');
const _ = require('lodash');

const DCS = {
    gamePath: '', // 游戏文件路径
    filePath: '', // 游戏files文件路径
    gameConfig: {
        gameId: 'DCS'
    }
};
// 初始化MFD
DCS.init = (dll, store, getPath, win) => {
    // step1: 缓存参数
    DCS.win = win;
    DCS.dll = dll;
    DCS.getPath = getPath;
    DCS.store = store;

    // step2: 初始化DCS文件信息及配置信息
    DCS.initInfo()
};
// 初始化DCS文件信息及配置信息
DCS.initInfo = () => {
    // step1: 初始化（读取）gamePath
    DCS.gamePath = FileManager.getGamePathForSimWithKey(DCS.gameConfig.gameId);
    // step2: 初始化（读取）filePath
    DCS.filePath = FileManager.getGameFilesPathForSim(DCS.gamePath);
    // step3: 初始化（读取）tempPath
    DCS.tempPath = FileManager.getGameTempPathForSim(DCS.filePath);
    // step4：初始化（读取）game_config.json配置文件信息
    DCS.gameConfig = _.merge({}, DCS.gameConfig, FileManager.getGameConfig(DCS.gamePath));
}
// 提取游戏配置文件信息
DCS.extractConfigForGame = (arg) => {

}
// 激活游戏配置文件信息
DCS.activeConfigForGame = (arg) => {
    
}
module.exports = DCS;