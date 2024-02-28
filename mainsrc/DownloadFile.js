var fs = require("fs");
var request = require("request");

var DownloadHistory = {};
var mainWindow = undefined;
const {
  ipcMain
} = require('electron');

module.exports.Init = function (_mainWindow) {
  mainWindow = _mainWindow;
}

function DownloadFileProgress(url, savePath, func) {
  try {
    var receivedBytes = 0;
    var totalBytes = 0;
    const req = request(url);
    let stream = fs.createWriteStream(savePath);
    req.pipe(stream).on("close", function (err) {
      func(undefined, receivedBytes, totalBytes);
    });
    req.on('response', (data) => {
      // 更新总文件字节大小
      totalBytes = parseInt(data.headers['content-length'], 10);
    });

    req.on('data', (chunk) => {
      // 更新下载的文件块字节大小
      receivedBytes += chunk.length;
      func(0, receivedBytes, totalBytes);
    });

    req.on('error', (error) => {
      func(error, receivedBytes, totalBytes);
    });
  } catch (error) {
    func(error, 0, 0);
  }
}
//error 0:正在下载  undefined:下载完成 其他任何为下载失败
ipcMain.on('WWTHID_DownloadFile', function (event, arg) {
  if (DownloadHistory[arg.savePath] === undefined || DownloadHistory[arg.savePath].error !== 0) {
    DownloadHistory[arg.savePath] = {
      url: arg.url,
      savePath: arg.savePath,
      error: 0,
      receivedBytes: 0,
      totalBytes: 0
    }
    /*setTimeout(() => {
      DownloadHistory["C:\\Users\\wwt-D\\AppData\\Roaming\\SimAppPro\\Download\\Application\\VirtualCockpit_1.0.0.7z"] = {
        url: "http://????/download/SimAppProPlugin/VirtualCockpit/VirtualCockpit_1.0.0.7z",
        savePath: "C:\\Users\\wwt-D\\AppData\\Roaming\\SimAppPro\\Download\\Application",
        error: undefined,
        receivedBytes: 65,
        totalBytes: 65
      };

      mainWindow.webContents.send('WWTHID_DownloadFileMessage', {
        savePath: "C:\\Users\\wwt-D\\AppData\\Roaming\\SimAppPro\\Download\\Application\\VirtualCockpit_1.0.0.7z",
        error: undefined,
        receivedBytes: 65,
        totalBytes: 65
      });
    }, 1000);*/
    DownloadFileProgress(arg.url, arg.savePath, function (error, receivedBytes, totalBytes) {
      var objectdh = DownloadHistory[arg.savePath];
      if (error === undefined) {
        objectdh.error = undefined;
      } else if (error !== 0) {
        objectdh.error = error;
      }
      objectdh.receivedBytes = receivedBytes;
      objectdh.totalBytes = totalBytes;
      try {
        mainWindow.webContents.send('WWTHID_DownloadFileMessage', {
          savePath: arg.savePath,
          error: error,
          receivedBytes: receivedBytes,
          totalBytes: totalBytes
        });
      } catch (error) {}
    });

    event.returnValue = true;
  } else {
    event.returnValue = false;
  }
});

ipcMain.on('WWTHID_DownloadFileHistory', function (event, arg) {
  event.returnValue = DownloadHistory;
});

ipcMain.on('WWTHID_DeleteDownloadFileHistory', function (event, arg) {
  delete DownloadHistory[arg];
});