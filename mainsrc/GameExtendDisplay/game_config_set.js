const fs = require('fs');
const { app } = require('electron');

const game_config_set = {}
// 检查文件是否存在
game_config_set.isFileExist = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}
// 初始化GameExtendDisplay配置文件路径
game_config_set.getFilePathForGED = () => {
  var userPath = app.getPath('userData')
  userPath = userPath + '/GameExtendDisplay'
  if (!game_config_set.isFileExist(userPath)) {
    game_config_set.creatFilePath(userPath)
  }
  return userPath
}
// 写入GED配置文件
game_config_set.setConfigForGED = (filePath, content) => {
  const newPath = filePath  + '\\GED_config.json'
  if (game_config_set.isFileExist(newPath)) {
    fs.writeFileSync(newPath, JSON.stringify(content, null, 2), 'utf8');
  } else {
    game_config_set.creatFilePath(filePath)
    fs.writeFileSync(newPath, JSON.stringify(content, null, 2), 'utf8');
  }
}
// 根据游戏显示器设备获取对应游戏显示器设备的数据存储文件路径（如果没有，则创建）
game_config_set.getFilePathWithKey = (key) => {
  var userPath = app.getPath('userData')
  userPath = userPath + '/GameExtendDisplay'
  if (game_config_set.isFileExist(userPath)) {
    userPath = userPath + '/' + key
    if (game_config_set.isFileExist(userPath)) {
      return userPath
    } else {
      game_config_set.creatFilePath(userPath)
    }
  } else {
    game_config_set.creatFilePath(userPath)
    userPath = userPath + '/' + key
    game_config_set.creatFilePath(userPath)
  }
  return userPath
}
// 创建文件
game_config_set.creatFilePath = (filePath) => {
  // MFD，创建MFD文件夹路径
  fs.mkdir(filePath, {
    recursive: true
  }, (err) => {
    return err
  });
}
// 写入配置文件
game_config_set.setConfigWithKey = (key, filePath, content) => {
  const newPath = filePath + '/' + key + '_config.json'
  if (game_config_set.isFileExist(newPath)) {
    fs.writeFileSync(newPath, JSON.stringify(content, null, 2), 'utf8');
  } else {
    game_config_set.creatFilePath(filePath)
    fs.writeFileSync(newPath, JSON.stringify(content, null, 2), 'utf8');
  }
}
// 读取配置文件
game_config_set.getConfigWithKey = (key, filePath) => {
  const newPath = filePath + '/' + key + '_config.json'
  if (game_config_set.isFileExist(newPath)) {
    const jsonString = fs.readFileSync(newPath, 'utf8');
    return JSON.parse(jsonString)
  } else {
    game_config_set.creatFilePath(filePath)
    fs.writeFileSync(newPath, JSON.stringify({}, null, 2), 'utf8');
  }
  return {}
}
module.exports = game_config_set;
