const ipcMain = require('electron').ipcMain;

module.exports.Init = function (screen) {

  ipcMain.on('WWTHID_ScreenRect', function (event, arg) {
    let displays = screen.getAllDisplays();

    var _ScreenRect = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }

    for (var a of displays) {
      var point = screen.dipToScreenPoint({
        x: a.bounds.x,
        y: a.bounds.y
      });
      a.bounds.x = point.x;
      a.bounds.y = point.y;
      a.bounds.width = Math.round(a.bounds.width * a.scaleFactor);
      a.bounds.height = Math.round(a.bounds.height * a.scaleFactor);
      if (a.bounds.x < _ScreenRect.left) {
        _ScreenRect.left = a.bounds.x;
      }
      if (a.bounds.y < _ScreenRect.top) {
        _ScreenRect.top = a.bounds.y;
      }
      if (a.bounds.x + a.bounds.width > _ScreenRect.right) {
        _ScreenRect.right = a.bounds.x + a.bounds.width;
      }
      if (a.bounds.y + a.bounds.height > _ScreenRect.bottom) {
        _ScreenRect.bottom = a.bounds.y + a.bounds.height;
      }
    }

    event.returnValue = _ScreenRect;
  });
  ipcMain.on('WWTHID_AllDisplaysWH', function (event, arg) {
    let displays = screen.getAllDisplays();

    for (var a of displays) {
      var point = screen.dipToScreenPoint({
        x: a.bounds.x,
        y: a.bounds.y
      });
      a.bounds.x = point.x;
      a.bounds.y = point.y;
      a.bounds.width *= a.scaleFactor;
      a.bounds.height *= a.scaleFactor;
    }

    event.returnValue = displays;
  });
  ipcMain.on('WWTHID_MainScreenWH', function (event, arg) {
    let display = screen.getPrimaryDisplay();
    var point = screen.dipToScreenPoint({
      x: display.bounds.x,
      y: display.bounds.y
    });
    var _MainScreenWH = {
      x: point.x,
      y: point.y,
      width: display.bounds.width * display.scaleFactor,
      height: display.bounds.height * display.scaleFactor
    }

    event.returnValue = _MainScreenWH;
  });
}