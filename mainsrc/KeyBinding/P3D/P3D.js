/*
 * @Author: lixingguo 
 * @Date: 2024-01-19 16:49:38 
 * @Last Modified by: lixingguo
 * @Last Modified time: 2024-01-19 17:19:14
 */
const FileManager = require('../FileManager.js');
const _ = require('lodash');

const P3D = {
    gamePath: '', // 游戏文件路径
    filePath: '', // 游戏files文件路径
    gameConfig: {
        gameId: 'P3D'
    }
};
// 初始化MFD
P3D.init = (dll, store, getPath, win) => {
    // step1: 缓存参数
    P3D.win = win;
    P3D.dll = dll;
    P3D.getPath = getPath;
    P3D.store = store;

    // step2: 初始化P3D文件信息及配置信息
    P3D.initInfo()
};
// 初始化P3D文件信息及配置信息
P3D.initInfo = () => {
    // step1: 初始化（读取）gamePath
    P3D.gamePath = FileManager.getGamePathForSimWithKey(P3D.gameConfig.gameId);
    // step2: 初始化（读取）filePath
    P3D.filePath = FileManager.getGameFilesPathForSim(P3D.gamePath);
    // step3: 初始化（读取）tempPath
    P3D.tempPath = FileManager.getGameTempPathForSim(P3D.filePath);
    // step4：初始化（读取）game_config.json配置文件信息
    P3D.gameConfig = _.merge({}, P3D.gameConfig, FileManager.getGameConfig(P3D.gamePath))
}
// 提取游戏配置文件信息
P3D.extractConfigForGame = (arg) => {

}
// 激活游戏配置文件信息
P3D.activeConfigForGame = (arg) => {
    
}
module.exports = P3D;