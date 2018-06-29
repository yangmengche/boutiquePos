import { Component, OnInit } from '@angular/core';
import { ReceiptModel, ReceiptItemModel } from '../../model/model';
import { DataProviderService } from '../../service/data-provider.service';
import { MatTableDataSource } from '@angular/material';
import { PAYBY } from '../../model/def';
import { ItemService } from '../../service/item.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-update-receipt-page',
  templateUrl: './update-receipt-page.component.html',
  styleUrls: ['./update-receipt-page.component.css']
})
export class UpdateReceiptPageComponent implements OnInit {
  public receipt: ReceiptModel;
  public itemDataSource = new MatTableDataSource<any>();
  public saleDate = moment();
  public payBy = PAYBY;

  constructor(
    private dataProvider: DataProviderService,
    private itemSrv: ItemService,
    private router: Router,
  ) { }

  ngOnInit() {
    if(this.dataProvider.updateReceipt){
      this.receipt = this.dataProvider.updateReceipt;
      this.itemDataSource.data = this.receipt.items;
      this.saleDate = moment(this.receipt.date);
      // delete this.dataProvider.reportItem;
    }else{
      this.router.navigate(['/', 'reportPage']);
    }
  }

  public onSubmit(){
    this.receipt.date = this.saleDate.toDate();
    console.log(this.receipt);
    this.itemSrv.updateReceipt(this.receipt).subscribe((res)=>{
      if(res.nModified === 1){
        delete this.dataProvider.updateReceipt;
        this.router.navigate(['/', 'reportPage']);
      }
    });
  }
  
  public onBack(){
    this.router.navigate(['/', 'reportPage']);
  }

  public getTotalPrice() {
    return this.receipt.items.reduce((acc, item) => acc + item.marketPrice*item.quantity, 0);
  }

  public getTotalQuantity() {
    this.receipt.quantity =  this.receipt.items.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
    return this.receipt.quantity;
  }
}
