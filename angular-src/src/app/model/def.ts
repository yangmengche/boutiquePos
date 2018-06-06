export const PAYBY = [
  { 'key': 'CASH', 'value': '現金' },
  { 'key': 'CREDITCARD', 'value': '信用卡' }
];

export const PAYBY_MAP={};
for (let i in PAYBY){
  PAYBY_MAP[PAYBY[i].key]=PAYBY[i].value;
}

export const SIZE = ['F', '3S', '2S', 'XS', 'S', 'M', 'L', 'XL', '2L', '3L', '4L', '5L'];
export const SUPPLIER_TYPE = [
  { 'key': 'CONSIGNMENT', 'value': '寄賣' },
  { 'key': 'BUYOUT', 'value': '賣斷' }
];

export const SUPPLIER_TYPE_MAP={};
for(let i in SUPPLIER_TYPE){
  SUPPLIER_TYPE_MAP[SUPPLIER_TYPE[i].key] = SUPPLIER_TYPE[i].value;
}