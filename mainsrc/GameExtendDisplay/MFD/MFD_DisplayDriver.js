const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const Global = require('../../../www/js/Global_Electron.js');
var spawn = require('child_process').spawn;

const MFD_DisplayDriver = {}
// 检查文件是否存在
MFD_DisplayDriver.isFileExist = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
};
// 判断是否需要下载DisplayLink
MFD_DisplayDriver.getDisplayLinkInfo = async (store) => {
  try {
    const filePrefix = 'DisplayLink USB Graphics Software for Windows';
    let isDownload = false;
    const infoUrl = Global.getDownloadURL(store) + 'MFD/Driver/UpdateInfo.json';
    var res = await Global.getJSONSync(infoUrl);
    if (_.isEmpty(res)) {
      return false;
    }
    var newFileName = res.fileName;
    MFD_DisplayDriver.driverName = newFileName;
    MFD_DisplayDriver.driverDownloadName = '~' + newFileName;
    MFD_DisplayDriver.driverPath = path.join(MFD_DisplayDriver.driverDir, newFileName);
    MFD_DisplayDriver.driverDownloadPath = path.join(MFD_DisplayDriver.driverDir, MFD_DisplayDriver.driverDownloadName);
    var fileArrayByDir = fs.readdirSync(MFD_DisplayDriver.driverDir);
    for (var fileName of fileArrayByDir) {
      if (fileName.indexOf(filePrefix) == 0 && fileName.indexOf('.exe') >= 0) {
        if (newFileName == fileName) {
          isDownload = true;
        } else {
          var filePath = path.join(MFD_DisplayDriver.driverDir, fileName);
          fs.unlinkSync(filePath);
        }
      }
    }
    return isDownload;
  } catch (err) {
    return false;
  }
};
// 下载DisplayLink驱动
MFD_DisplayDriver.downloadDisplayLink = async (store, MFDWin) => {
  try {
    // 删除旧的文件
    if (MFD_DisplayDriver.isFileExist(MFD_DisplayDriver.driverPath)) {
      fs.unlinkSync(MFD_DisplayDriver.driverPath);
    }
    await Global.DownloadFileSync(Global.getDownloadURL(store) + 'MFD/Driver/' + MFD_DisplayDriver.driverName, MFD_DisplayDriver.driverDir, MFD_DisplayDriver.driverDownloadName, (err, count, total) => {
      MFD_DisplayDriver.DriverDownloadInfo = {
        error: err,
        count: count,
        total: total
      }
      if (MFDWin) {
        MFDWin.webContents.send('GED-mfd-driver-download-info', MFD_DisplayDriver.DriverDownloadInfo)
      }
      // 下载成功后重命名
      if (err === undefined) {
        fs.renameSync(MFD_DisplayDriver.driverDownloadPath, MFD_DisplayDriver.driverPath);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
// 校验驱动
MFD_DisplayDriver.checkoutDriver = (dll, checkObject) => {
  // 是否安装驱动
  const result = false
  if (dll.IsInstallDisplayLink()) {
    checkObject.mfdDriver.status = 'success';
    checkObject.mfdDriverInstall.status = 'success';
    checkObject.mfdDriverDownload.status = 'success';
    return { checkObject: checkObject, result: true }
  } else {
    checkObject.mfdDriver.status = 'error';
    checkObject.mfdDriverInstall.status = 'error';
  }
  // 是否下载驱动
  MFD_DisplayDriver.isDownloadDisplayLink = MFD_DisplayDriver.isFileExist(MFD_DisplayDriver.driverPath);
  if (MFD_DisplayDriver.isDownloadDisplayLink) {
    checkObject.mfdDriver.status = 'success';
    checkObject.mfdDriverDownload.status = 'success';
  } else {
    checkObject.mfdDriver.status = 'error';
    checkObject.mfdDriverDownload.status = 'error';
    return { checkObject: checkObject, result: false }
  }
  if (checkObject.mfdDriverInstall.status === 'error') {
    checkObject.mfdDriver.status = 'error';
    return { checkObject: checkObject, result: false }
  }
  return { checkObject: checkObject, result: result }
};
// 安装驱动
MFD_DisplayDriver.installDriver = () => {
  spawn('cmd.exe', ['/c', MFD_DisplayDriver.driverPath]);
}
module.exports = MFD_DisplayDriver;
