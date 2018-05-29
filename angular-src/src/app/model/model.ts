export interface SupplierModel {
  _id?: string;
  name: string;
  type: string;
  shareRate: number;
}

export interface ItemModel{
  _id?: string;
  code: string;
  name: string;
  pic: string;
  supplierID: {
    _id: string,
    name: string
  },
  category: string;
  size: string;
  cost: number;
  listPrice: number;
  marketPrice: number;
  stock: number
}

export interface ItemAddModel{
  _id?: string;
  code: string;
  name: string;
  pic: string;
  supplierID: string,
  category: string;
  size: string;
  cost: number;
  listPrice: number;
  marketPrice: number;
}

export interface CategoryModel{
  _id?: string;
  name: string
}

export interface ReceiptItemModel{
  _id?: string;
  code: string;
  name: string;
  category: string;
  size: string;
  cost: number;
  listPrice: number;
  marketPrice: number;
  salePrice: number;
  quantity: number  
}

export interface ReceiptModel{
  items: ReceiptItemModel[],
  payBy: string,
  pay: number,
  remark: String,
  returnRefID?: string  
}