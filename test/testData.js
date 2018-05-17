const config = require('../config/config');
const def = require('../libs/db/def');

let accounts = {
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
exports.accounts = accounts;

let suppliers = {
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
exports.suppliers = suppliers;

let categories = {
  'c01':{
    'name': 'C01'
  },
  'c02':{
    'name': 'C02'
  },
  'c03':{
    'name': 'C03'
  }
}
exports.categories = categories;

let items = {
  's01-c01-001-S':{
    'code': '1901-0301-001-03',
    'name': 's01-c01-001',
    'supplierID': '$s01',
    'category': categories.c01.name,
    'size': def.size[3],
    'cost': suppliers.s01.shareRate * 390,
    'listPrice': 390,
    'marketPrice':590
  },
  's01-c01-001-M':{
    'code': '1901-0301-001-04',
    'name': 's01-c01-001',
    'supplierID': '$s01',
    'category': categories.c01.name,
    'size': def.size[4],
    'cost': suppliers.s01.shareRate * 390,
    'listPrice': 390,
    'marketPrice':590
  },
  's01-c01-001-L':{
    'code': '1901-0301-001-05',
    'name': 's01-c01-001',
    'supplierID': '$s01',
    'category': categories.c01.name,
    'size': def.size[5],
    'cost': suppliers.s01.shareRate * 390,
    'listPrice': 390,
    'marketPrice':590
  },
  's01-c02-001-3S':{
    'code': '1901-0302-001-00',
    'name': 's01-c02-001',
    'supplierID': '$s01',
    'category': categories.c02.name,
    'size': def.size[0],
    'cost': suppliers.s01.shareRate * 190,
    'listPrice': 190,
    'marketPrice':190
  },  
  's02-c02-001-XL':{
    'code': '1902-0302-001-06',
    'name': 's02-c02-001',
    'supplierID': '$s02',
    'category': categories.c02.name,
    'size': def.size[6],
    'cost': 290,
    'listPrice': 490,
    'marketPrice':680
  },
  's02-c02-001-2L':{
    'code': '1902-0302-001-07',
    'name': 's02-c02-001',
    'supplierID': '$s02',
    'category': categories.c02.name,
    'size': def.size[7],
    'cost': 290,
    'listPrice': 490,
    'marketPrice':680
  },
  's02-c02-001-3L':{
    'code': '1902-0302-001-08',
    'name': 's02-c02-001',
    'supplierID': '$s02',
    'category': categories.c02.name,
    'size': def.size[8],
    'cost': 390,
    'listPrice': 590,
    'marketPrice':780
  },      
}
exports.items = items;

let stocks = {
  'stock01':{
    'itemID': '$s01-c01-001-S', 
    'quantity': 5
  },
  'stock02':{
    'itemID': '$s01-c01-001-M', 
    'quantity': 10
  },
  'stock03':{
    'itemID': '$s01-c01-001-L', 
    'quantity': 8
  },
  'stock04':{
    'itemID': '$s01-c02-001-3S', 
    'quantity': 3
  },
  'stock05':{
    'itemID': '$s02-c02-001-2L', 
    'quantity': 3
  },
  'stock06':{
    'itemID': '$s02-c02-001-3L', 
    'quantity': 3
  }          
}
exports.stocks = stocks;

let receipts ={
  'r01':{
    items:[
      {
        'itemID': '$s01-c01-001-M',
        'salePrice': items["s01-c01-001-M"].marketPrice,
        'quantity': 1
      }
    ],
    payBy: def.payBy[0],
    pay: items["s01-c01-001-M"].marketPrice
  },
  'r02':{
    items:[
      {
        'itemID': '$s01-c01-001-M',
        'salePrice': items["s01-c01-001-M"].marketPrice,
        'quantity': 2
      },
      {
        'itemID': '$s01-c02-001-3S',
        'salePrice': items["s01-c02-001-3S"].marketPrice,
        'quantity': 1
      },
      {
        'itemID': '$s02-c02-001-2L',
        'salePrice': items["s02-c02-001-2L"].marketPrice,
        'quantity': 2
      }            
    ],
    payBy: def.payBy[1],
    pay: 590*2+190+680*2
  },
  'r03':{
    items:[
      {
        'itemID': '$s02-c02-001-2L',
        'salePrice': items["s02-c02-001-2L"].marketPrice,
        'quantity': 1
      },
      {
        'itemID': '$s02-c02-001-3L',
        'salePrice': items["s02-c02-001-3L"].marketPrice,
        'quantity': 2
      }
    ],
    payBy: def.payBy[1],
    pay: 680+780*2-240
  }    
}

exports.receipts = receipts;