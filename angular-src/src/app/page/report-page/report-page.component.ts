import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { DataProviderService } from '../../service/data-provider.service';
import * as moment from 'moment';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit {
  private itemDataSource = new MatTableDataSource<any>();
  private revenue = 0;

  constructor(
    private itemSrv: ItemService,
    private router: Router,
    private dataProvider: DataProviderService
  ) { }

  ngOnInit() {
  }

  public async loadLists() {
    this.itemSrv.getReceipts().subscribe((response) => {
      this.itemDataSource.data = response.docs;
    });
  }

  public getRevenue() {
    this.revenue = this.itemDataSource.data.reduce((acc, item) => acc + item.pay, 0);
    return this.revenue;
  }

  public getQuantity() {
    return this.itemDataSource.data.reduce((acc, item) => acc + item.quantity, 0);
  }

  public getProfit() {
    let cost = this.itemDataSource.data.reduce((acc, receipt) => {
      let receiptCost = receipt.items.reduce((acc2, item) => acc2 + item.cost, 0);
      return acc + receiptCost;
    }, 0);
    return this.revenue - cost;
  }

  public onRowClick(row) {
    this.dataProvider.data = row;
    this.router.navigate(['/', 'reportDetailPage', row._id]);
  }

  public onQueryToday() {
    let from = moment().startOf('day').toDate();
    let to = moment().endOf('day').toDate();
    this.itemSrv.getReceipts(from, to).subscribe((response) => {
      this.itemDataSource.data = response.docs;
    });    
  }

  public onQueryThisWeek() {
    let from = moment().startOf('week').toDate();
    let to = moment().endOf('week').toDate();
    this.itemSrv.getReceipts(from, to).subscribe((response) => {
      this.itemDataSource.data = response.docs;
    });    
  }
  
  public onQueryThisMonth() {
    let from = moment().startOf('month').toDate();
    let to = moment().endOf('month').toDate();
    this.itemSrv.getReceipts(from, to).subscribe((response) => {
      this.itemDataSource.data = response.docs;
    });    
  }
  
  public onQuerythisYear() {
    let from = moment().startOf('year').toDate();
    let to = moment().endOf('year').toDate();
    this.itemSrv.getReceipts(from, to).subscribe((response) => {
      this.itemDataSource.data = response.docs;
    });    
  }
  
  
}
