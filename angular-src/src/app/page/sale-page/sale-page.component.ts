import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReceiptModel, ReceiptItemModel } from '../../model/model';
import { MatTableDataSource } from '@angular/material';
import { ItemService } from '../../service/item.service';
import { isNull } from 'util';
import { PAYBY } from '../../model/def';

@Component({
  selector: 'app-sale-page',
  templateUrl: './sale-page.component.html',
  styleUrls: ['./sale-page.component.css']
})
export class SalePageComponent implements OnInit {
  private storageKey = 'sale-itemlist';
  private saleItem: ReceiptItemModel;
  private receipt: ReceiptModel;
  private itemDataSource = new MatTableDataSource<any>();
  private payBy = PAYBY;
  private quaCheck = 0;
  constructor(
    private router: Router,
    private itemSrv: ItemService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.saleItem = {
      _id: '',
      code: '',
      name: '',
      category: '',
      size: '',
      cost: 0,
      listPrice: 0,
      marketPrice: 0,
      salePrice: 0,
      quantity: 0
    };

    this.actRoute.params.subscribe(params => {
      if('code' in params){
        this.saleItem.code = params['code'];
      }else{
        localStorage.removeItem(this.storageKey);
      }
    });    

    this.receipt = JSON.parse(localStorage.getItem(this.storageKey));
    if(isNull(this.receipt)){
      this.receipt = {
        items: [],
        payBy: this.payBy[0], 
        pay: 0,
        quantity: 0, 
        remark:''
      }
    }
    this.itemDataSource.data = this.receipt.items;
  }

  public getTotalCost() {
    // this.receipt.pay = this.receipt.items.map(t => t.marketPrice).reduce((acc, value) => acc + value, 0);
    if(this.quaCheck != this.receipt.quantity){
      this.receipt.pay = this.receipt.items.reduce((acc, item) => acc + item.marketPrice*item.quantity, 0);
      this.quaCheck = this.receipt.quantity;
    }
    return this.receipt.pay;
  }

  public getTotalQuantity() {
    this.receipt.quantity =  this.receipt.items.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
    return this.receipt.quantity;
  }

  public onScan() {
    this.router.navigate(['/scanPage', '/salePage']);
  }

  public onAddItem(){
    this.itemSrv.getItemByCode(this.saleItem.code).subscribe((res)=>{
      if(!isNull(res) && res.length > 0){
        let item = res[0];
        this.receipt.items.push({
          _id: item._id,
          code: item.code,
          name: item.name,
          category: item.category,
          size: item.size,
          cost: item.cost,
          listPrice: item.listPrice,
          marketPrice: item.marketPrice,
          salePrice: item.marketPrice,
          quantity: 1
        });
        this.itemDataSource.data=  this.receipt.items;
        localStorage.setItem(this.storageKey, JSON.stringify(this.receipt));
      }
    });
  }

  public deleteItem(item){
    for( let i in this.receipt.items){
      if(this.receipt.items[i]._id === item._id){
        this.receipt.items.splice(Number(i), 1);
        break;
      }
    }
    this.itemDataSource.data = this.receipt.items;
    localStorage.setItem(this.storageKey, JSON.stringify(this.receipt));
  }

  public onSubmit(){
    console.log(this.receipt);
    this.itemSrv.addReceipt(this.receipt).subscribe((res)=>{
      if(res.id){
        this.router.navigate(['/itemPage']);
      }
    });
  }
}
