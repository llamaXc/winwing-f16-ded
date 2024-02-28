const os = require('os');
const { app } = require('electron');
const si = require('systeminformation');
var g_Devices = {};
var g_Part = {};

module.exports.init = async (mainWindow) => {
  const cpus = os.cpus();
  const systemInfo = await si.system();
  const uuid = await si.uuid();
  var nowCpuName = '';
  for (const cpu of cpus) {
    nowCpuName = cpu.model;
    break;
  }
  setTimeout(() => {
    try {
      var datas = [];
      for (const path in g_Devices) {
        const device = g_Devices[path];

        const part_info = [];

        const partByid = g_Part[path];
        for (const pid in partByid) {
          part_info.push(partByid[pid]);
        }
        datas.push({
          product_id: String(device.pid),
          supplier_id: String(device.vid),
          product_name: device.product_name,
          supplier_name: device.vendor_name,
          cpu_info: nowCpuName,
          motherboard_info: systemInfo.model,
          hardware_uuid: uuid.hardware,
          os_uuid: uuid.os,
          simapppro_version: app.getVersion(),
          part_info: JSON.stringify(part_info)
        });
      }
      mainWindow.webContents.send('WWTHID_SendUploadDeviceInfo', datas);
    } catch (error) {

    }
  }, 10 * 1000)
}

module.exports.Devices = (devs) => {
  g_Devices = devs;
}

module.exports.Part = (Part) => {
  g_Part = Part;
}
