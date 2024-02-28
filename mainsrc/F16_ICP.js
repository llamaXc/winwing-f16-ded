
var WWTHIDJSAPI;

let count = 0
module.exports.init = function (_WWTHIDJSAPI) {
  WWTHIDJSAPI = _WWTHIDJSAPI;

  setInterval(() => {
    WWTHIDJSAPI.ICPDrawStart();
    WWTHIDJSAPI.ICPDraw(0, 1, "SECONDS " + count, false, "DCS");
    count++
    WWTHIDJSAPI.ICPDrawEnd(); 
  }, 1000); 
}
