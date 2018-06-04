import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
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
  private static queryType = ['DAY', 'WEEK', 'MONTH', 'YEAR'];
  private itemDataSource = new MatTableDataSource<any>();
  private revenue = 0;
  private pageSize = 10;
  private pageEvent: PageEvent;
  private currentQuery='DAY';
  private queryMap={};

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private itemSrv: ItemService,
    private router: Router,
    private dataProvider: DataProviderService
  ) { }

  ngOnInit() {
    this.queryMap = {
      'DAY': this.queryToday.bind(this),
      'WEEK': this.queryThisWeek.bind(this),
      'MONTH': this.queryThisMonth.bind(this),
      'YEAR': this.querythisYear.bind(this)
    }
    this.queryToday(0, this.pageSize);
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
    this.dataProvider.reportItem = row;
    this.router.navigate(['/', 'reportDetailPage', row._id]);
  }

  public onQuery(type: string){
    this.queryMap[type](0, this.pageSize);
  }

  public queryToday(skip?: number, limit?:number) {
    let from = moment().startOf('day').toDate();
    let to = moment().endOf('day').toDate();
    this.currentQuery= 'DAY';
    this.itemSrv.getReceipts(from, to, skip, limit).subscribe((response) => {
      this.itemDataSource.data = response.docs;
      this.paginator.length = response.total;
    });
  }

  public queryThisWeek(skip?: number, limit?:number) {
    let from = moment().startOf('week').toDate();
    let to = moment().endOf('week').toDate();
    this.currentQuery= 'WEEK';
    this.itemSrv.getReceipts(from, to, skip, limit).subscribe((response) => {
      this.itemDataSource.data = response.docs;
      this.paginator.length = response.total;
    });    
  }
  
  public queryThisMonth(skip?: number, limit?:number) {
    let from = moment().startOf('month').toDate();
    let to = moment().endOf('month').toDate();
    this.currentQuery= 'MONTH';
    this.itemSrv.getReceipts(from, to, skip, limit).subscribe((response) => {
      this.itemDataSource.data = response.docs;
      this.paginator.length = response.total;
    });    
  }
  
  public querythisYear(skip?: number, limit?:number) {
    let from = moment().startOf('year').toDate();
    let to = moment().endOf('year').toDate();
    this.currentQuery= 'YEAR';
    this.itemSrv.getReceipts(from, to, skip, limit).subscribe((response) => {
      this.itemDataSource.data = response.docs;
      this.paginator.length = response.total;
    });    
  }
  
  public onPageChance($event){
    console.log('change page');
    this.pageSize = $event.pageSize;
    this.queryMap[this.currentQuery]($event.pageIndex*$event.pageSize, $event.pageSize);
  }
}
