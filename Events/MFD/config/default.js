module.exports.config = {
  mainMonitorApplyStatus: 0, // 0：未应用，1：应用
  dcsCameraModeApplyStatus: 0,
  monitorLayoutApplyStatus: 0,
  mfdSettingApplyStatus: 0,
  dedLayoutApplyStatus: 0,
  dcsCameraMode: '1Camera',
  dcsCameraModeApply: '1Camera',
  monitorLayoutReset: 0,
  currentMod: 'FA-18C',
  applyMod: '',
  cockpitImgBase: '',
  mainMonitorInfoById: {},
  usbMonitorInfoById: {},
  allMonitorInfoById: {},
  dcsAppSettings: {
    windowPlacement: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  },
  dcsMonitor: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    aspect: 0
  },
  dcsOffset: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    aspect: 0
  },
  dcsOptions: {
    graphics: {
      multiMonitorSetup: 'wwtMonitor',
      width: 1920,
      height: 1080,
      aspect: 1920 / 1080
    }
  },
  dcsViewports: {
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
      dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          isDcsMonitorShow: false, // 是否在不绑定显示器id的情况下显示仪表
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
          dcsMonitor: { // dcs游戏中仪表画面的位置和尺寸大小（lua）
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
    //       dcsMonitor: {
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
    //       dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
          dcsMonitor: {
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
