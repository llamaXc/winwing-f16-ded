// const F16ICP = require('./ICP_LCD/F16_ICP.js');
// const DCSData = require('./DCSData');
// const DeviceCongfig = require('../www/js/DeviceConfig');
// const AllDevices = DeviceCongfig(false, false);

// var Part = {};
// module.exports.init = function (WWTHIDJSAPI) {
//   F16ICP.init(WWTHIDJSAPI, DCSData);
// };

// module.exports.Part = function (_Part) {
//   Part = _Part;
//   var ICPDevs = [];
//   for (const path in Part) {
//     if (Part[path] && Part[path][AllDevices.PIDByName.ICP]) {
//       ICPDevs.push(Part[path][AllDevices.PIDByName.ICP]);
//     }
//   }

//   throw new Error(JSON.stringify(ICPDevs))
  
//   F16ICP.ICPDevs(ICPDevs);
// }
