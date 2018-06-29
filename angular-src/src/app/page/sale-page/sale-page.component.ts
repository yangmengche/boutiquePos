import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReceiptModel, ReceiptItemModel } from '../../model/model';
import { MatTableDataSource } from '@angular/material';
import { ItemService } from '../../service/item.service';
import { isNull } from 'util';
import { PAYBY } from '../../model/def';
import { DataProviderService } from '../../service/data-provider.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';

@Component({
  selector: 'app-sale-page',
  templateUrl: './sale-page.component.html',
  styleUrls: ['./sale-page.component.css']
})
export class SalePageComponent implements OnInit {
  private storageKey = 'sale-itemlist';
  public saleItem: ReceiptItemModel;
  public receipt: ReceiptModel;
  public itemDataSource = new MatTableDataSource<any>();
  public payBy = PAYBY;
  private quaCheck = 0;
  public saleDate = moment();
  constructor(
    private router: Router,
    private itemSrv: ItemService,
    private actRoute: ActivatedRoute,
    private dataProvider: DataProviderService
  ) { }

  ngOnInit() {
    this.initSaleItem();
    this.actRoute.params.subscribe(params => {
      if('code' in params){
        this.saleItem.code = params['code'];
      }else{
        delete this.dataProvider.saleItem;
        // localStorage.removeItem(this.storageKey);
      }
    });
    this.initReceipt();
  }

  private initReceipt(){
    // this.receipt = JSON.parse(localStorage.getItem(this.storageKey));
    this.receipt = this.dataProvider.saleItem;
    if(!this.receipt){
      this.receipt = {
        items: [],
        payBy: this.payBy[0].key, 
        pay: 0,
        quantity: 0, 
        remark:''
      }
    }
    this.itemDataSource.data = this.receipt.items;
    this.saleDate = moment();
  }

  private initSaleItem(){
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
  }


  public getTotalPrice() {
    return this.receipt.items.reduce((acc, item) => acc + item.marketPrice*item.quantity, 0);
  }

  public getTotalQuantity() {
    this.receipt.quantity =  this.receipt.items.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
    return this.receipt.quantity;
  }

  public onScan() {
    this.router.navigate(['/scanPage', '/salePage']);
  }

  public onSelectItem(){
    this.router.navigate(['/itemPage', '/salePage']);
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
        // localStorage.setItem(this.storageKey, JSON.stringify(this.receipt));
        this.dataProvider.saleItem = this.receipt;
        this.receipt.pay = this.receipt.items.reduce((acc, item) => acc + item.marketPrice*item.quantity, 0);
      }
    });
  }

  public onQunatitychanged(value: number){
    this.receipt.pay = this.receipt.items.reduce((acc, item) => acc + item.marketPrice*item.quantity, 0);
  }

  public deleteItem(item){
    for( let i in this.receipt.items){
      if(this.receipt.items[i]._id === item._id){
        this.receipt.items.splice(Number(i), 1);
        break;
      }
    }
    this.itemDataSource.data = this.receipt.items;
    this.dataProvider.saleItem = this.receipt;
    // localStorage.setItem(this.storageKey, JSON.stringify(this.receipt));
  }

  public onSubmit(){
    console.log(this.receipt);
    let now = moment();
    if(!this.saleDate.isSame(now, 'day')){
      this.receipt.date = this.saleDate.toDate();
      this.receipt.date.setHours(12, 0, 0, 0); // if user set sale date, set time to 12:00
    }
    this.itemSrv.addReceipt(this.receipt).subscribe((res)=>{
      if(res.id){
        this.initSaleItem();
        delete this.dataProvider.saleItem;
        // localStorage.removeItem(this.storageKey);
        this.initReceipt();
      }
    });
  }

  public onBack(){
    this.router.navigate(['/', 'itemPage']);
  }  
}
