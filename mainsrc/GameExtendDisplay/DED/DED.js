
const DED = {};
// 初始化MFD
DED.init = (dll, store, getPath, win) => {
    // A1:缓存参数
    DED.win = win;
    DED.dll = dll;
    DED.getPath = getPath;
    DED.store = store;
};
module.exports = DED;