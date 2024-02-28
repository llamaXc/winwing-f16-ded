module.exports.config = {
  isDebug: true,
  gameOptions: {
    graphics: {
      multiMonitorSetup: 'wwtMonitor',
      width: 1920,
      height: 1080,
      aspect: 1920 / 1080
    }
  },
  modsInfo: {
    'F-16C': {
      iconPath: '/Data/Art/CkptArt/Skins/1/icon.png',
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
        }
      }
    }
  }
}
