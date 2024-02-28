
var WWTHIDJSAPI;
var ICPDevs;

module.exports.Part = function (_Part) {
  // Part = _Part;
  // var ICPDevs = [];
  // for (const path in Part) {
  //   if (Part[path] && Part[path][AllDevices.PIDByName.ICP]) {
  //     ICPDevs.push(Part[path][AllDevices.PIDByName.ICP]);
  //   }
  // }

  // setDevs(ICPDevs);
}

function setDevs (_ICPDevs) {
  ICPDevs = _ICPDevs;
}

module.exports.init = function (_WWTHIDJSAPI) {
  WWTHIDJSAPI = _WWTHIDJSAPI;

   var aaaaaa = 0;
  setInterval(() => {
    WWTHIDJSAPI.ICPDrawStart();
    if (aaaaaa == 0) {
      WWTHIDJSAPI.ICPDraw(0, 1, "DCS", false, "DCS");
      WWTHIDJSAPI.ICPDraw(0, 13, "A", false, "DCS");
      WWTHIDJSAPI.ICPDraw(0, 26, "123", true, "DCS");
      WWTHIDJSAPI.ICPDraw(0, 3 * 13, "TESTING", false, "DCS");
      WWTHIDJSAPI.ICPDraw(0, 4 * 13, "DCS", true, "DCS");

      WWTHIDJSAPI.ICPDraw(18 * 8, 1, "TEST", true, "DCS")

      aaaaaa = 1;
    } else {
      WWTHIDJSAPI.ICPDraw(0, 1, "PAPI PLANES", false, "DCS");
      WWTHIDJSAPI.ICPDraw(0, 36, "TEST TEST TEST 112.2", false, "DCS");

      aaaaaa = 0;
    }
    WWTHIDJSAPI.ICPDrawEnd();
  }, 3000); 
}
