/*
 * @Author: lixingguo 
 * @Date: 2024-01-19 16:49:06 
 * @Last Modified by: lixingguo
 * @Last Modified time: 2024-01-19 17:17:53
 */
const fs = require('fs');
const { app } = require('electron');

const FileManager = {}
// 检查文件是否存在
FileManager.isFileExist = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}
// 初始化SimAppPro中KeyBinding文件路径
FileManager.getKeyPathForSim = () => {
  var tempPath = app.getPath('userData')
  tempPath = tempPath + '/KeyBinding'
  if (!FileManager.isFileExist(tempPath)) {
    FileManager.creatFilePath(tempPath)
  }
  return tempPath
}
// 初始化SimAppPro中KeyBinding下存放files的文件路径
FileManager.getFilePathForSim = () => {
  var tempPath = app.getPath('userData')
  tempPath = tempPath + '/KeyBinding/files'
  if (!FileManager.isFileExist(tempPath)) {
    FileManager.creatFilePath(tempPath)
  }
  return tempPath
}
// 创建文件
FileManager.creatFilePath = (filePath) => {
  fs.mkdir(filePath, {
    recursive: true
  }, (err) => {
    return err
  });
}
// 判断文件夹是否为空,并返回结果
FileManager.isDirectoryEmpty = (filePath) => {
  try {
    const files = fs.readdirSync(filePath);
    return files.length === 0;
  } catch (error) {
    return false;
  }
}
// 删除空文件夹,并返回删除结果
FileManager.deleteDirectory = (filePath) => {
  if (FileManager.isDirectoryEmpty(filePath)) {
    try {
      fs.rmdirSync(filePath);
      return true
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
// 读取KeyBinding配置文件
FileManager.getConfigForKeyBinding = () => {
  var filePath = app.getPath('userData')
  filePath = filePath + '/KeyBinding/'
  var tempPath = filePath + 'KB_config.json'
  if (FileManager.isFileExist(tempPath)) {
    const jsonString = fs.readFileSync(tempPath, 'utf8');
    return JSON.parse(jsonString)
  } else {
    FileManager.creatFilePath(filePath)
    fs.writeFileSync(tempPath, JSON.stringify({}, null, 2), 'utf8');
    return {}
  }
}
// 写入KeyBinding配置文件
FileManager.setConfigForKeyBinding = (content) => {
  var tempPath = app.getPath('userData')
  tempPath = tempPath + '/KeyBinding/KEYBIND_config.json'
  if (FileManager.isFileExist(tempPath)) {
    fs.writeFileSync(tempPath, JSON.stringify(content, null, 2), 'utf8');
  } else {
    FileManager.creatFilePath(tempPath)
    fs.writeFileSync(tempPath, JSON.stringify(content, null, 2), 'utf8');
  }
}
/************************************以上是KeyBinding配置文件读写*****************************************************/

/**----------------------------------------我是万中无一分割线------------------------------------------------------**/

/************************************以下是游戏相关配置文件读写*****************************************************/
// 获取（创建）SimAppPro中游戏文件夹
FileManager.getGamePathForSimWithKey = (key) => {
  var keyPath = app.getPath('userData')
  keyPath = keyPath + '/KeyBinding/' + key
  if (FileManager.isFileExist(keyPath)) {
    return keyPath
  } else {
    FileManager.creatFilePath(keyPath)
  }
  return keyPath
}
// 获取（创建）SimAppPro中游戏下files文件夹
FileManager.getGameFilesPathForSim = (path) => {
  var filePath = path + '/files'
  if (FileManager.isFileExist(filePath)) {
    return filePath
  } else {
    FileManager.creatFilePath(filePath)
  }
  return filePath
}
// 获取（创建）SimAppPro中游戏下temp文件夹
FileManager.getGameTempPathForSim = (path) => {
  var filePath = path + '/temp'
  if (FileManager.isFileExist(filePath)) {
    return filePath
  } else {
    FileManager.creatFilePath(filePath)
  }
  return filePath
}
// 写入游戏相关配置文件
FileManager.setGameConfig = (filePath, content) => {
  filePath = filePath + '/'
  const newPath = filePath + 'game_config.json'
  if (FileManager.isFileExist(newPath)) {
    fs.writeFileSync(newPath, JSON.stringify(content, null, 2), 'utf8');
  } else {
    FileManager.creatFilePath(filePath)
    fs.writeFileSync(newPath, JSON.stringify(content, null, 2), 'utf8');
  }
}
// 读取配置文件
FileManager.getGameConfig = (filePath) => {
  filePath = filePath + '/'
  const newPath = filePath + 'game_config.json'
  if (FileManager.isFileExist(newPath)) {
    const jsonString = fs.readFileSync(newPath, 'utf8');
    return JSON.parse(jsonString)
  } else {
    FileManager.creatFilePath(filePath)
    fs.writeFileSync(newPath, JSON.stringify({}, null, 2), 'utf8');
    return {}
  }
}
module.exports = FileManager;
