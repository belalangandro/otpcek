// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app.js":[function(require,module,exports) {
const express = require('express');
const {
  Client
} = require('whatsapp-web.js');
const qrcode = require('qrcode');
const app = express();
const client = new Client();
app.use(express.json());

// Endpoint untuk mengirim pesan WhatsApp
app.post('/send-message', (req, res) => {
  const {
    phoneNumber,
    message
  } = req.body;

  // Kirim pesan ke nomor HP yang ditentukan
  client.sendMessage(phoneNumber + '@c.us', message).then(() => {
    res.status(200).json({
      success: true,
      message: 'Pesan berhasil dikirim'
    });
  }).catch(error => {
    res.status(500).json({
      success: false,
      message: 'Gagal mengirim pesan',
      error: error.message
    });
  });
});

// Endpoint untuk mendapatkan QR code
app.get('/qr-code', (req, res) => {
  // Generate QR code menggunakan session dari client WhatsApp
  qrcode.toDataURL(client.qrCode, (err, url) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghasilkan QR code'
      });
    } else {
      // Kirim QR code sebagai respons
      res.status(200).send(`<img src="${url}" alt="QR Code" />`);
    }
  });
});

// Inisialisasi WhatsApp client 
client.on('qr', qr => {
  // QR code tersedia, dapatkan URL-nya
  client.qrCode = qr;
});
client.on('ready', () => {
  console.log('Bot WhatsApp sudah terhubung');
});
client.initialize();
module.exports = app;
},{}],"index.js":[function(require,module,exports) {
const app = require('./app');
const port = '8888';
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
},{"./app":"app.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map