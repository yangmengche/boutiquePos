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
