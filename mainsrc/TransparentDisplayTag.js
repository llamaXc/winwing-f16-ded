
const {
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');

module.exports = class {
  constructor (Debug) {
    this.Debug = Debug == true;
    this.initCompleted = false;
    this.changeContent = '';
    this.changeBackColor = '000000';
    this.imgs = {};
  }

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Boolean} isThrough
   */
  createWindow (x, y, width = 200, height = 80, isThrough = true) {
    this.windowObject = new BrowserWindow({
      x: x,
      y: y,
      title: 'TransparentDisplayTag',
      width: width,
      height: height,
      autoHideMenuBar: true,
      icon: path.join(__dirname, '../www/logo', 'SimAppPro.png'),
      // backgroundColor: '#252526',
      webPreferences: {
        devTools: this.Debug,
        nodeIntegration: true
      },
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
      focusable: this.Debug === true
    });

    this.windowObject.setAlwaysOnTop(true, 'screen-saver', 0);

    this.windowObject.once('ready-to-show', () => {
      if (this.windowObject !== undefined) {
        this.windowObject.show();
      }
    })

    if (isThrough) {
      this.windowObject.setIgnoreMouseEvents(true, {
        forward: true
      });
    }

    this.windowObject.webContents.on('did-finish-load', function () {});

    ipcMain.on('DisplayTag_initCompleted', this.setInitChangeContent);

    var htmlPath = path.join(__dirname, '../view', 'indexDisplayTag.html');

    this.windowObject.loadFile(htmlPath);
  }

  closeWindow () {
    ipcMain.removeListener('DisplayTag_initCompleted', this.setInitChangeContent);
    this.windowObject.close();
    this.windowObject = undefined;
  }

  setContent (content) {
    this.changeContent = content;
    this.setInitChangeContent();
  }

  setBackColor (color) {
    this.changeBackColor = color;
    this.setInitChangeContent();
  }

  /**
   * 设置多张背景图
   * @param {*} key
   * @param {*} style
   */
  setStyleOfDiv (key, style) {
    this.imgs[key] = style;
    this.setInitChangeContent();
  }

  setPropertyOfStyleOfDiv (key, name, value) {
    if (this.imgs[key] !== undefined) {
      this.imgs[key][name] = value;
      this.setInitChangeContent();
    }
  }

  setInitChangeContent = () => {
    this.initCompleted = true;
    if (this.windowObject !== undefined) {
      this.windowObject.webContents.send('changeBackColor', this.changeBackColor);
      this.windowObject.webContents.send('changeContent', this.changeContent);
      this.windowObject.webContents.send('changeimgs', this.imgs);
      this.windowObject.webContents.send('changeOpacity', this.changeOpacity);
    }
  }
}
