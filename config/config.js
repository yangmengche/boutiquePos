const path = require('path');
const home = process.env.HOME || process.env.USERPROFILE;

let config = {
  'logPath': path.resolve(home, 'boutiquePos', 'log'),
  'dbPath': 'mongodb://localhost:27017/boutiquePos',
  'resourcePath': path.resolve(home, 'boutiquePos', 'resource'),
  'defaultAccount': { 'account': 'admin', 'type': 'adm', 'password': '612808f8ce3b9ad99d139402d1100e12' },
  'secretKey': 'HRADjM7ZM34DGxTs6QB5tYa2qoNpcwAT',
  'serverPath': 'resources/app/bin/www',
  'noImagePath': 'resources/noImage.jpeg',
  'tempPath': path.resolve(home, 'boutiquePos', 'temp'),
};

switch (process.env.NODE_ENV) {
  case 'unitTest':
    config.dbPath = 'mongodb://localhost:27017/boutiquePosTest';
    config.logPath = path.resolve(home, 'boutiquePosTest', 'log');
    config.resourcePath = path.resolve(home, 'boutiquePosTest', 'resource');
    config.tempPath= path.resolve(home, 'boutiquePosTest', 'temp');
    break;
  case 'local':
    config.serverPath = 'bin/www';
    break;
}

module.exports = config;