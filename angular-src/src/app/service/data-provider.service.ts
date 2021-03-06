import { Injectable } from '@angular/core';
import { ReceiptModel, ItemModel } from '../model/model';
@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  public reportItem: ReceiptModel;
  public saleItem: ReceiptModel;
  public updateReceipt: ReceiptModel;
  public item: ItemModel;
  public itemPageSetting: any;
  public ReportPageSetting: any;
  public addItemPageSetting: any;
  constructor() {
    this.itemPageSetting={};
    this.ReportPageSetting={};
    this.addItemPageSetting={};
  }
}
