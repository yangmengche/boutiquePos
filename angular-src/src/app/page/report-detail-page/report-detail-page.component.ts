import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { ItemService } from '../../service/item.service';
import { ReceiptModel, ReceiptItemModel } from '../../model/model';
import { DataProviderService } from '../../service/data-provider.service';

@Component({
  selector: 'app-report-detail-page',
  templateUrl: './report-detail-page.component.html',
  styleUrls: ['./report-detail-page.component.css']
})
export class ReportDetailPageComponent implements OnInit {
  public receipt: ReceiptModel;

  constructor(
    private router: Router,
    private itemSrv: ItemService,
    private actRoute: ActivatedRoute,
    private dataProvider: DataProviderService
  ) { }

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      if('id' in params){        
      }
    });
    this.receipt = this.dataProvider.reportItem;
  }

  public getReceipt(id: string){

  }

  public getTotalPrice() {
    return this.receipt.items.reduce((acc, item) => acc + item.marketPrice * item.quantity, 0);
  }

  public getTotalSalePrice() {
    return this.receipt.items.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
  }  

  public getTotalCost() {
    return this.receipt.items.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  public getTotalQuantity() {
    return this.receipt.items.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
  }

  public onBack(){
    this.router.navigate(['/', 'reportPage']);
  }  
}
