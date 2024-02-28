const ipcMain = require('electron').ipcMain;
const log = require('electron-log');
const dcslua = require('../www/plugins/DCSEvent/scripts/dcs-lua/dcs-lua');
const dcsindication = require('../www/plugins/DCSEvent/scripts/dcs-indication/dcs-indication');

var Handle_Func = [];
var ReceiveFunc = {};

var Init_Func = [];
var End_Func = [];

var SendToDCS_func;

var CB_original_Func = [];
var CB_addOutput_Func = [];
var CB_getOutput_Func = [];
var CB_addCommon_Func = [];

module.exports.CreateDCSData = function (store) {
  var DebugApp = store.get('DebugApp');

  function MessageHandle (_message) {
    for (var a = 0; a < Handle_Func.length;) {
      try {
        Handle_Func[a](_message);
        a++;
      } catch (error) {
        Handle_Func.splice(a, 1);
      }
    }
    for (const a in _message) {
      if (ReceiveFunc[a] != undefined) {
        for (const b of ReceiveFunc[a]) {
          b(_message[a]);
        }
      }
    }
  }

  dcslua.beg(16536, function (error, data) {
    switch (error) {
      case 0:
        log.info(data);
        break;
      case 1:
        try {
          var msg = JSON.parse(data.replace('server_receive:', ''));
          if (msg.func == 'mod') {
            for (const func of Init_Func) {
              func(msg.msg);
            }
          } else if (msg.func == 'mission' && msg.msg == 'stop') {
            for (const func of End_Func) {
              func(msg.msg);
            }
          } else if (msg.func == 'mission' && msg.msg == 'start') {
            CB_original_Func = [];
            CB_addOutput_Func = [];
            CB_getOutput_Func = [];
            CB_addCommon_Func = [];
            dcslua.clearOutput();
            dcslua.clearCommon();
          }

          var _message = {};
          _message[msg.func] = msg.msg;
          MessageHandle(_message);
        } catch (error) { }

        break;
      case 2:
        if (DebugApp) {
          log.info(data);
        }
        break;
      case 3:
        log.warn(data);
        break;
      case 4:
        log.error(data);
        break;
      default:
        break;
    }
  });

  dcslua.CB_addOutput(function (msg) {
    var _message = {};
    for (var a in msg) {
      var dev = msg[a];
      for (var b in dev) {
        _message[a + '.' + b] = dev[b];
      }
    }
    MessageHandle(_message);

    for (let i = 0; i < CB_addOutput_Func.length;) {
      const func = CB_addOutput_Func[i];
      if (func !== undefined) {
        func(msg);
        i++;
      } else {
        CB_addOutput_Func.splice(i, 1);
      }
    }
  });

  dcslua.CB_addCommon((msg) => {
    for (let i = 0; i < CB_addCommon_Func.length;) {
      const func = CB_addCommon_Func[i];
      if (func !== undefined) {
        func(msg);
        i++;
      } else {
        CB_addCommon_Func.splice(i, 1);
      }
    }
  });

  dcslua.CB_getOutput(function (msg) {
    for (let i = 0; i < CB_getOutput_Func.length;) {
      const func = CB_getOutput_Func[i];
      if (func !== undefined) {
        func(msg);
        i++;
      } else {
        CB_getOutput_Func.splice(i, 1);
      }
    }
  });

  SendToDCS_func = function (key, message) {
    try {
      var s = key.split('.');
      var _message = {};
      _message[s[0]] = {};
      _message[s[0]][s[1]] = message;
      dcslua.setInput(_message);
    } catch (error) {
      console.log(error);
    }
  }

  ipcMain.on('WWTHID_SendToDCS', function (event, arg) {
    try {
      for (var a in arg) {
        SendToDCS_func(a, arg[a]);
      }
    } catch (error) {
      console.log(error);
    }
  })

  dcslua.CB_original(function (status, msg) {
    for (let i = 0; i < CB_original_Func.length;) {
      const func = CB_original_Func[i];
      if (func !== undefined) {
        func(status, msg);
        i++;
      } else {
        CB_original_Func.splice(i, 1);
      }
    }
  });
}

module.exports.SendToDCS = function (key, message) {
  if (SendToDCS_func != undefined) {
    SendToDCS_func(key, message);
  }
}

module.exports.Receive = function (msg, func) {
  if (ReceiveFunc[msg] != undefined) {
    ReceiveFunc[msg].push(func);
  } else {
    ReceiveFunc[msg] = [func];
  }
}

module.exports.ResetReceive = function () {
  ReceiveFunc = {};
}

module.exports.Handle = function (func) {
  Handle_Func.push(func);
}

module.exports.RemoveHandle = function (func) {
  for (var a in Handle_Func) {
    if (Handle_Func[a] == func) {
      Handle_Func.splice(a, 1);
      break;
    }
  }
}

var addOutputBuffer = {};
var addOutputBufferTimeout;

module.exports.addOutput = function (_message) {
  for (var a in _message) {
    for (var b in _message[a]) {
      if (addOutputBuffer[a] === undefined) {
        addOutputBuffer[a] = {};
      }
      addOutputBuffer[a][b] = _message[a][b];
    }
  }
  clearTimeout(addOutputBufferTimeout);
  addOutputBufferTimeout = setTimeout(() => {
    dcslua.addOutput(addOutputBuffer);
    addOutputBuffer = {};
  }, 1000);
}

var addCommonBuffer = {};
var addCommonBufferTimeout;
module.exports.addCommon = function (_message) {
  for (var _key in _message) {
    var msg = _message[_key];
    addCommonBuffer[_key] = msg;
  }
  clearTimeout(addCommonBufferTimeout);
  addCommonBufferTimeout = setTimeout(() => {
    dcslua.addCommon(addCommonBuffer);
    addCommonBuffer = {};
  }, 1000);
}

module.exports.original = function (key, data) {
  dcslua.original(key, data);
}

module.exports.AddInitFunc = function (func) {
  Init_Func.push(func);
}

module.exports.AddEndFunc = function (func) {
  End_Func.push(func);
}

module.exports.ADD_CB_addOutput = function (func) {
  CB_addOutput_Func.push(func);
}

module.exports.ADD_CB_addCommon = function (func) {
  CB_addCommon_Func.push(func);
}

module.exports.ADD_CB_getOutput = function (func) {
  CB_getOutput_Func.push(func);
}

module.exports.ADD_CB_original = function (func) {
  CB_original_Func.push(func);
}

module.exports.parseIndicationData = dcsindication.parseIndicationData;

this.AddInitFunc(() => {
  this.ResetReceive();
});
