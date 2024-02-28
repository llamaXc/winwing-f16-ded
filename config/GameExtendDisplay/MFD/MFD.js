/*
 * @Description: 游戏外设-MFD设备-基础配置文件
 * @Author: lixingguo
 * @Date: 2023-12-22 09:11:15
 * @LastEditTime: 2023-12-29 09:14:34
 * @LastEditors: lixingguo
 */
module.exports.config = {
  deviceID: 'MFD',
  curGameId: 'DCS', // 当前界面展示的游戏id
  gamesItems: [
    {
      id: 'DCS', // 游戏id（游戏唯一标识符,需要和主线程力的gameKey保持一致）
      label: 'DCS World', // 游戏名称
      img: 'DCS.png'
    },
    {
      id: 'BMS', // 游戏id（游戏唯一标识符,需要和主线程力的gameKey保持一致）
      label: 'Falcon BMS', // 游戏名称
      img: 'BMS.png'
    }
  ],
  monitorLayoutReset: 0, // 显示器排布和方向是否需要重置上一次应用的状态 0.不需要 1.需要
  lastUsedMonitorInfoById: {} // 上一次游戏运行时点击"应用"，保存的显示器信息集合
};
