const path = require('path');
const home = process.env.HOME || process.env.USERPROFILE;

let config={
  'logPath':'.boutiquePos',
  'dbPath': 'mongodb://localhost:27017/boutiquePos',
  'resourcePath': path.resolve(home, 'boutiquePos', 'resource'),
  'defaultAccount': { 'account':'admin', 'type':'adm', 'password':'612808f8ce3b9ad99d139402d1100e12'},
  'secretKey' : 'HRADjM7ZM34DGxTs6QB5tYa2qoNpcwAT',
  'serverPath': 'resources/app/bin/www'
}

switch(process.env.NODE_ENV){
  case 'unitTest':
    config.dbPath= 'mongodb://localhost:27017/boutiquePosTest';
    config.logPath= '.boutiquePosTest';
    config.resourcePath= path.resolve(home, 'boutiquePosTest', 'resource');
  break;
  case 'local':
    config.serverPath = 'bin/www'
  break;
}

module.exports = config;