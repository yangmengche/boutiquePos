import { Injectable } from '@angular/core';
import { ReceiptModel, ItemModel } from '../model/model';
@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  public reportItem: ReceiptModel;
  public saleItem: ReceiptModel;
  public item: ItemModel;
  constructor() { }
}
