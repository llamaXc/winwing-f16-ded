module.exports.config = {
  isDebug: true,
  dcsOptions: {
    graphics: {
      multiMonitorSetup: 'wwtmonitor'
    }
  },
  modsInfo: {
    'FA-18C': {
      iconPath: '/DemoMods/aircraft/FA-18C/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/FA-18C/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/FA-18C/Skins/1/icon_buy.png',
      cockpitImgPath: 'F18_Cockpit.png', // 机舱图片地址
      instruments: {
        LEFT_MFCD: {
          overlayerBackColor: '#2aff17',
          // overlayerBackImg: 'DDI_BG.png',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 120,
            top: 110,
            right: 120 + 200,
            bottom: 110 + 172,
            width: 200,
            height: 172
          }
        },
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          // overlayerBackImg: 'DDI_BG.png',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 690,
            top: 110,
            right: 690 + 200,
            bottom: 110 + 172,
            width: 200,
            height: 172
          }
        },
        CENTER_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 408,
            top: 385,
            right: 408 + 200,
            bottom: 385 + 185,
            width: 200,
            height: 185
          }
        }
      }
    },
    'F-16C': {
      iconPath: '/DemoMods/aircraft/F-16C/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/F-16C/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/F-16C/Skins/1/icon_buy.png',
      cockpitImgPath: 'F16_Cockpit.png', // 机舱图片地址
      instruments: {
        LEFT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 170,
            top: 185,
            right: 170 + 166,
            bottom: 185 + 128,
            width: 166,
            height: 128
          }
        },
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 685,
            top: 185,
            right: 685 + 166,
            bottom: 185 + 128,
            width: 166,
            height: 128
          }
        },
        EHSI: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 436,
            top: 476,
            right: 436 + 142,
            bottom: 476 + 120,
            width: 142,
            height: 120
          }
        },
        DED: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          },
          tailorMonitor: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          }
          // uiMonitor: {
          //   left: 436,
          //   top: 476,
          //   right: 436 + 142,
          //   bottom: 476 + 120,
          //   width: 142,
          //   height: 120
          // }
        }
      }
    },
    'AH-64D': {
      iconPath: '/DemoMods/aircraft/AH-64D/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/AH-64D/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/AH-64D/Skins/1/icon_buy.png',
      cockpitImgPath: 'AH-64D_Cockpit.png', // 机舱图片地址
      instruments: {
        LEFT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'AH-64D_MFCD_leaderLine.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 64,
            top: 256 + 64,
            right: -8 - 64,
            bottom: -6 - 64
          },
          uiMonitor: {
            left: 110,
            top: 240,
            right: 110 + 210,
            bottom: 240 + 226,
            width: 210,
            height: 226
          }
        },
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'AH-64D_MFCD_leaderLine.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 64,
            top: 256 + 64,
            right: -8 - 64,
            bottom: -6 - 64
          },
          uiMonitor: {
            left: 720,
            top: 240,
            right: 720 + 210,
            bottom: 240 + 226,
            width: 210,
            height: 226
          }
        },
        TEDAC: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'AH-64D_TEDAC_leaderLine.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 40,
            top: 256 + 40,
            right: -8 - 40,
            bottom: -6
          },
          uiMonitor: {
            left: 402,
            top: 94,
            right: 402 + 214,
            bottom: 94 + 210,
            width: 214,
            height: 210
          }
        }
      }
    },
    'A-10C': {
      iconPath: '/DemoMods/aircraft/A-10C/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/A-10C/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/A-10C/Skins/1/icon_buy.png',
      cockpitImgPath: 'A-10C_Cockpit.png', // 机舱图片地址
      instruments: {
        LEFT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 108,
            top: 114,
            right: 108 + 182,
            bottom: 114 + 210,
            width: 182,
            height: 210
          }
        },
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 742,
            top: 122,
            right: 742 + 155,
            bottom: 122 + 210,
            width: 182,
            height: 210
          }
        }
      }
    },
    'A-10C_2': {
      iconPath: '/DemoMods/aircraft/A-10C_2/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/A-10C_2/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/A-10C_2/Skins/1/icon_buy.png',
      cockpitImgPath: 'A-10C_2_Cockpit.png', // 机舱图片地址
      instruments: {
        LEFT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 108,
            top: 114,
            right: 108 + 182,
            bottom: 114 + 210,
            width: 182,
            height: 210
          }
        },
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 742,
            top: 122,
            right: 742 + 155,
            bottom: 122 + 210,
            width: 182,
            height: 210
          }
        }
      }
    },
    // AV8BNA: {
    //   iconPath: '/DemoMods/aircraft/AV8BNA/Skins/1/icon.png',
    //   iconActivePath: '/DemoMods/aircraft/AV8BNA/Skins/1/icon_active.png',
    //   iconBuyPath: '/DemoMods/aircraft/AV8BNA/Skins/1/icon_buy.png',
    //   cockpitImgPath: 'AV8BNA_Cockpit.png', // 机舱图片地址
    //   instruments: {
    //     LEFT_MFCD: {
    //       overlayerBackColor: '#2aff17',
    //       tailorMonitor: {
    //         left: 2,
    //         top: 256,
    //         right: -2,
    //         bottom: 0
    //       },
    //       uiMonitor: {
    //         left: 140,
    //         top: 200,
    //         right: 140 + 188,
    //         bottom: 200 + 198,
    //         width: 188,
    //         height: 198
    //       }
    //     },
    //     RIGHT_MFCD: {
    //       overlayerBackColor: '#2aff17',
    //       tailorMonitor: {
    //         left: 2,
    //         top: 256,
    //         right: -2,
    //         bottom: 0
    //       },
    //       uiMonitor: {
    //         left: 651,
    //         top: 214,
    //         right: 651 + 188,
    //         bottom: 214 + 198,
    //         width: 188,
    //         height: 198
    //       }
    //     }
    //   }
    // },
    F14: {
      iconPath: '/DemoMods/aircraft/F14/Skins/icon.png',
      iconActivePath: '/DemoMods/aircraft/F14/Skins/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/F14/Skins/icon_buy.png',
      cockpitImgPath: 'F14_Cockpit.png', // 机舱图片地址
      instruments: {
        F14_VDI: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 394,
            top: 140,
            right: 394 + 220,
            bottom: 140 + 210,
            width: 220,
            height: 210
          }
        },
        F14_HSD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 424,
            top: 390,
            right: 740 + 182,
            bottom: 274 + 200,
            width: 182,
            height: 200
          }
        }
      }
    },
    'JF-17': {
      iconPath: '/DemoMods/aircraft/JF-17/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/JF-17/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/JF-17/Skins/1/icon_buy.png',
      cockpitImgPath: 'JF-17_Cockpit.png', // 机舱图片地址
      instruments: {
        LEFT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'JF-17_MFCD_leaderLine.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 143,
            top: 256 + 64,
            right: -8 - 143,
            bottom: -6 - 64
          },
          uiMonitor: {
            left: 94,
            top: 112,
            right: 94 + 242,
            bottom: 112 + 288,
            width: 242,
            height: 288
          }
        },
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'JF-17_MFCD_leaderLine.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 143,
            top: 256 + 64,
            right: -8 - 143,
            bottom: -6 - 64
          },
          uiMonitor: {
            left: 652,
            top: 112,
            right: 652 + 235,
            bottom: 112 + 301,
            width: 235,
            height: 301
          }
        },
        CENTER_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'JF-17_MFCD_leaderLine.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 143,
            top: 256 + 64,
            right: -8 - 143,
            bottom: -6 - 64
          },
          uiMonitor: {
            left: 404,
            top: 298,
            right: 404 + 200,
            bottom: 298 + 262,
            width: 200,
            height: 262
          }
        }
      }
    },
    'Ka-50': {
      iconPath: '/DemoMods/aircraft/Ka-50/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/Ka-50/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/Ka-50/Skins/1/icon_buy.png',
      cockpitImgPath: 'Ka-50_Cockpit.png', // 机舱图片地址
      instruments: {
        Shkval: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 438,
            top: 140,
            right: 438 + 206,
            bottom: 140 + 172,
            width: 206,
            height: 172
          }
        },
        ABRIS: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'KA-50_ABRIS_leaderLine.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 111 - 5,
            top: 256 + 10,
            right: -8 - 111 - 5,
            bottom: -6 - 64
          },
          uiMonitor: {
            left: 698,
            top: 188,
            right: 698 + 168,
            bottom: 188 + 260,
            width: 168,
            height: 260
          }
        }
      }
    },
    'M-2000C': {
      iconPath: '/DemoMods/aircraft/M-2000C/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/M-2000C/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/M-2000C/Skins/1/icon_buy.png',
      cockpitImgPath: 'M-2000C_Cockpit.png', // 机舱图片地址
      instruments: {
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerBackImg: 'M-2000C_HDD.png',
          isEnableKeyGuideShow: true, // 是否显示按键指引启用项
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8 + 64,
            top: 256 + 64 - 24,
            right: -8 - 64,
            bottom: -6 - 64 - 24
          },
          uiMonitor: {
            left: 448,
            top: 210,
            right: 448 + 174,
            bottom: 210 + 176,
            width: 174,
            height: 176
          }
        }
      }
    },
    'MIG-21bis': {
      iconPath: '/DemoMods/aircraft/MIG-21bis/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/MIG-21bis/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/MIG-21bis/Skins/1/icon_buy.png',
      cockpitImgPath: 'MIG-21bis_Cockpit.png', // 机舱图片地址
      instruments: {
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 492,
            top: 290,
            right: 492 + 132,
            bottom: 290 + 160,
            width: 132,
            height: 160
          }
        }
      }
    },
    'F-15E': {
      iconPath: '/DemoMods/aircraft/F-15E/Skins/1/icon.png',
      iconActivePath: '/DemoMods/aircraft/F-15E/Skins/1/icon_active.png',
      iconBuyPath: '/DemoMods/aircraft/F-15E/Skins/1/icon_buy.png',
      cockpitImgPath: 'F15_Cockpit.png', // 机舱图片地址
      instruments: {
        LEFT_MFCD: {
          overlayerBackColor: '#2aff17',
          // overlayerBackImg: 'DDI_BG.png',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 120,
            top: 170,
            right: 120 + 230,
            bottom: 170 + 202,
            width: 230,
            height: 202
          }
        },
        RIGHT_MFCD: {
          overlayerBackColor: '#2aff17',
          // overlayerBackImg: 'DDI_BG.png',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 690,
            top: 170,
            right: 690 + 230,
            bottom: 170 + 202,
            width: 230,
            height: 202
          }
        },
        CENTER_MFCD: {
          overlayerBackColor: '#2aff17',
          overlayerTailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          tailorMonitor: {
            left: 8,
            top: 256,
            right: -8,
            bottom: -6
          },
          uiMonitor: {
            left: 426,
            top: 416,
            right: 426 + 180,
            bottom: 416 + 160,
            width: 180,
            height: 160
          }
        }
      }
    }
  }
}
