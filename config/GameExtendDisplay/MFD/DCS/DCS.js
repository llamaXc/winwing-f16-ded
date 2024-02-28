module.exports.config = {
  /** *****这里放各游戏特有的配置字段*********/
  dcsCameraMode: '1Camera', // 摄像机模型 1Camera或3Camera
  dcsCameraModeApply: '', // 点击“应用”时，选择的摄像机模型 1Camera或3Camera
  dcsCameraModeApplyStatus: 0, // 摄像机模式设置状态 0.未设置 1.已设置(检查判断使用字段)

  /** *****这以下都是各游戏共有的通用（必要）字段*********/
  gameId: 'DCS', // 游戏id（游戏唯一标识符,需要和主线程力的gameKey保持一致）
  gameName: 'DCS World', // 游戏名称
  gameRunningStatus: false, // 游戏运行状态
  gameRunningKey: 'DCS.exe', // 游戏运行时候的进程名称
  currentMod: 'FA-18C', // 当前选择的飞机模型
  applyMod: 'FA-18C', // 当前应用中的飞机模型
  mainMonitorApplyStatus: 0, // 游戏画面设置是否点击过"应用" 0：未应用，1：应用
  monitorLayoutApplyStatus: 0, // 显示器排布与方向是否点击过"应用" 0：未应用，1：应用
  mfdSettingApplyStatus: 0, // MFD设置是否点击过"应用" 0：未应用，1：应用
  applyStatusArray: ['mainMonitorApplyStatus', 'dcsCameraModeApplyStatus', 'monitorLayoutApplyStatus', 'mfdSettingApplyStatus'],
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
    'FA-18C': { // 机型
      name: 'FA-18C', // 名称
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        CENTER_MFCD: {
          id: [],
          name: 'CENTER_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'CENTER_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'F-16C': { // 机型
      name: 'F-16C', // 名称
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        EHSI: {
          id: [],
          name: 'EHSI',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'EHSI', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        DED: {
          id: [],
          name: 'DED',
          direction: 'landscape',
          isEnableKeyGuide: false,
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          isgameMonitorShow: false, // 是否在不绑定显示器id的情况下显示仪表
          gameConfigKey: 'DED', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
          overlayerOpacity: 0,
          overlayerTailorMonitor: { // 覆盖物剪切屏幕尺寸
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          },
          tailorMonitor: { // 画面剪切屏幕尺寸
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          },
          // uiMonitor: {//SimAppPro界面配置组件的位置和尺寸大小（DED隐藏）
          //   left: 0,
          //   top: 0,
          //   right: 0,
          //   bottom: 0,
          //   width: 0,
          //   height: 0
          // },
          gameMonitor: { // dcs游戏中仪表画面的位置和尺寸大小（lua）
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          },
          displayMonitor: { // D1显示器处于桌面的位置和尺寸大小
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
          }
        }
      }
    },
    'AH-64D': { // 机型
      name: 'AH-64D', // 名称
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        TEDAC: {
          id: [],
          name: 'TEDAC',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'TEDAC', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'A-10C': {
      name: 'A-10C',
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'A-10C_2': {
      name: 'A-10C_2',
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    // AV8BNA: {
    //   name: 'AV8BNA',
    //   instruments: {
    //     LEFT_MFCD: {
    //       id: [],
    //       name: 'LEFT_MFCD',
    //       direction: 'portrait',
    //       overlayerOpacity: 0,
    //       tailorMonitor: {
    //         left: 2,
    //         top: 64,
    //         right: -2,
    //         bottom: 0
    //       },
    //       uiMonitor: {
    //         left: 0,
    //         top: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: 0,
    //         height: 0
    //       },
    //       gameMonitor: {
    //         left: 0,
    //         top: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: 0,
    //         height: 0
    //       },
    //       displayMonitor: {
    //         left: 0,
    //         top: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: 0,
    //         height: 0
    //       }
    //     },
    //     RIGHT_MFCD: {
    //       id: [],
    //       name: 'RIGHT_MFCD',
    //       direction: 'portrait',
    //       overlayerOpacity: 0,
    //       tailorMonitor: {
    //         left: 2,
    //         top: 64,
    //         right: -2,
    //         bottom: 0
    //       },
    //       uiMonitor: {
    //         left: 0,
    //         top: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: 0,
    //         height: 0
    //       },
    //       gameMonitor: {
    //         left: 0,
    //         top: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: 0,
    //         height: 0
    //       },
    //       displayMonitor: {
    //         left: 0,
    //         top: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: 0,
    //         height: 0
    //       }
    //     }
    //   }
    // },
    F14: {
      name: 'F14',
      instruments: {
        F14_VDI: {
          id: [],
          name: 'F14_VDI',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'F14_VDI', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        F14_HSD: {
          id: [],
          name: 'F14_HSD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'F14_HSD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'JF-17': {
      name: 'JF-17',
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        CENTER_MFCD: {
          id: [],
          name: 'CENTER_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'CENTER_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'Ka-50': {
      name: 'Ka-50',
      instruments: {
        Shkval: {
          id: [],
          name: 'Shkval',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'Shkval', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        ABRIS: {
          id: [],
          name: 'ABRIS',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'ABRIS', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'M-2000C': {
      name: 'M-2000C',
      instruments: {
        RIGHT_MFCD: {
          id: [],
          name: 'RIGHT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'MIG-21bis': {
      name: 'MIG-21bis',
      instruments: {
        RIGHT_MFCD: {
          id: [],
          name: 'RIGHT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'F-15E': { // 机型
      name: 'F-15E', // 名称
      instruments: {
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        CENTER_MFCD: {
          id: [],
          name: 'CENTER_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'CENTER_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
    },
    'F-15E_WSO': { // 机型
      name: 'F-15E_WSO', // 名称
      instruments: {
        OUTER_LEFT_MFCD: {
          id: [],
          name: 'OUTER_LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'OUTER_LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        LEFT_MFCD: {
          id: [],
          name: 'LEFT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'LEFT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
          gameConfigKey: 'RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
        OUTER_RIGHT_MFCD: {
          id: [],
          name: 'OUTER_RIGHT_MFCD',
          direction: 'portrait',
          isEnableKeyGuide: false, // 是否启用按键指引
          isEnableKeyGuideShow: false, // 是否显示按键指引启用项
          gameConfigKey: 'OUTER_RIGHT_MFCD', // 修改游戏配置文件需要用到的对应位置的key值（要和游戏配置文件里保持一致哦）
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
