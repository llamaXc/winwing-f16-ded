module.exports.config = {
  /*******这里放各游戏特有的配置字段*********/
  bmsFovMode: '', // 视角类型 1.单屏幕60默认视角 2.双屏幕80默认视角 3.三屏幕100默认视角 4.自定义默认视角
  bmsFovNum: '', // 视角具体值
  bmsFovModeApplyStatus: 0, // 摄像机模式设置状态 0.未设置 1.已设置(检查判断使用字段)
  RTTClientName: 'RTTClient64.exe', // 游戏启动，需要同时启动的扩展配置文件

  /*******这以下都是各游戏共有的通用（必要）字段*********/
  gameId: 'BMS', // 游戏id（游戏唯一标识符,需要和主线程力的gameKey保持一致）
  gameName: 'Falcon BMS', // 游戏名称
  gameRunningStatus: false, // 游戏运行状态
  gameRunningKey: 'Falcon BMS.exe', // 游戏运行时候的进程名称
  currentMod: 'F-16C', // 当前选择的飞机模型
  applyMod: 'F-16C', // 当前应用中的飞机模型
  mainMonitorApplyStatus: 0, // 游戏画面设置是否点击过"应用" 0：未应用，1：应用
  monitorLayoutApplyStatus: 0, // 显示器排布与方向是否点击过"应用" 0：未应用，1：应用
  mfdSettingApplyStatus: 0, // MFD设置是否点击过"应用" 0：未应用，1：应用
  applyStatusArray:['mainMonitorApplyStatus', 'bmsFovModeApplyStatus', 'monitorLayoutApplyStatus', 'mfdSettingApplyStatus'],
  mainMonitorInfoById: {}, // 游戏主显示器使用的id信息
  usbMonitorInfoById: {}, // 游戏关联显示器使用的id信息
  // 游戏运行窗口各显示器信息集合
  gameViewports: {
    Center: {
      id: undefined,
      name: 'Center',
      direction: 'landscape',
      tailorMonitor: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      uiMonitor: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      gameMonitor: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      },
      displayMonitor: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      }
    }
  },
  stepActive: 0, // 当前检查到第几步(这里存储起来，是因为切换游戏的时候，检查步数会被重置)
  gameAppSettings: {
    windowPlacement: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  },
  gameMonitor: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    aspect: 0
  },
  gameOffset: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    aspect: 0
  },
  gameOptions: {
    graphics: {
      multiMonitorSetup: 'wwtMonitor',
      width: 1920,
      height: 1080,
      aspect: 1920 / 1080
    }
  },
  modsInfo: {
    'F-16C': { // 机型
      name: 'F-16C', // 名称
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'MFDLEFT', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
          overlayerOpacity: 0,
          overlayerTailorMonitor: {
            left: 2,
            top: 64,
            right: -2,
            bottom: 0
          },
          tailorMonitor: {
            left: 2,
            top: 64,
            right: -2,
            bottom: 0
          },
          uiMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          },
          gameMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          },
          displayMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          }
        },
        RIGHT_MFCD: {
          id: [],
          name: 'RIGHT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'MFDRIGHT', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
          overlayerOpacity: 0,
          overlayerTailorMonitor: {
            left: 2,
            top: 64,
            right: -2,
            bottom: 0
          },
          tailorMonitor: {
            left: 2,
            top: 64,
            right: -2,
            bottom: 0
          },
          uiMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          },
          gameMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          },
          displayMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          }
        }
      }
    }
  }
}
