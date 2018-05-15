const config = require('../config/config');

exports.accounts = {
  'adm': {
    'account': config.defaultAccount.account,
    'password': '1111',
  },
  'user1':{
    'account': 'user1',
    'password': '2222',
    'type': 'user'
  }
};

exports.suppliers = {
  's01':{
    'name': 'S01',
    'type': 'CONSIGNMENT',
    'shareRate': 0.65        
  },
  's02':{
    'name':'S02',
    'type': 'BUYOUT',
  }
}