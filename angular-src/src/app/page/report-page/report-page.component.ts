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
  private static queryType = ['DAY', 'WEEK', 'MONTH', 'YEAR', 'CUSTOM'];
  public itemDataSource = new MatTableDataSource<any>();
  public pageSetting = {
    index: 0,
    pageSize: 10,
    currentQuery: 'DAY',
    from: null,
    to: null
  }
  public revenue = 0;
  public quantity = 0;
  public profit = 0;

  private pageEvent: PageEvent;
  private queryMap = {};

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
      'YEAR': this.querythisYear.bind(this),
      'CUSTOM': this.queryByTimeSlot.bind(this)
    }
    this.initPageSetting();
    this.queryMap[this.pageSetting.currentQuery](this.pageSetting.index, this.pageSetting.pageSize);
  }

  ngOnDestroy() {
    this.dataProvider.ReportPageSetting = this.pageSetting;
  }

  private initPageSetting() {
    this.pageSetting = this.dataProvider.ReportPageSetting;
    this.pageSetting.index = this.pageSetting.index || 0;
    this.pageSetting.pageSize = this.pageSetting.pageSize || 10;
    this.pageSetting.currentQuery = this.pageSetting.currentQuery || 'DAY';
  }

  public onRowClick(row) {
    this.dataProvider.reportItem = row;
    this.router.navigate(['/', 'reportDetailPage', row._id]);
  }

  public onQuery(type: string) {
    this.queryMap[type](0, this.pageSetting.pageSize);
  }

  public onQueryByTimeSlot(){
    this.pageSetting.currentQuery = 'CUSTOM';
    this.queryByTimeSlot(this.pageSetting.index, this.pageSetting.pageSize);
  }

  public queryByTimeSlot(index?, limit?) {
    this.query(this.pageSetting.from.toDate(), this.pageSetting.to.toDate(), index, limit);
  }

  public queryToday(index?: number, limit?: number) {
    // let from = moment().startOf('day').toDate();
    // let to = moment().endOf('day').toDate();    
    this.pageSetting.from = moment().startOf('day').toDate();
    this.pageSetting.to = moment().endOf('day').toDate();
    this.pageSetting.currentQuery = 'DAY';
    this.query(this.pageSetting.from, this.pageSetting.to, index, limit);
  }

  public queryThisWeek(index?: number, limit?: number) {
    // let from = moment().startOf('week').toDate();
    // let to = moment().endOf('week').toDate();
    this.pageSetting.from = moment().startOf('week').toDate();
    this.pageSetting.to = moment().endOf('week').toDate();    
    this.pageSetting.currentQuery = 'WEEK';
    this.query(this.pageSetting.from, this.pageSetting.to, index, limit);
  }

  public queryThisMonth(index?: number, limit?: number) {
    // let from = moment().startOf('month').toDate();
    // let to = moment().endOf('month').toDate();
    this.pageSetting.from = moment().startOf('month').toDate();
    this.pageSetting.to = moment().endOf('month').toDate();    
    this.pageSetting.currentQuery = 'MONTH';
    this.query(this.pageSetting.from, this.pageSetting.to, index, limit);
  }

  public querythisYear(index?: number, limit?: number) {
    // let from = moment().startOf('year').toDate();
    // let to = moment().endOf('year').toDate();
    this.pageSetting.from = moment().startOf('year').toDate();
    this.pageSetting.to = moment().endOf('year').toDate();    
    this.pageSetting.currentQuery = 'YEAR';
    this.query(this.pageSetting.from, this.pageSetting.to, index, limit);
  }

  public query(from, to, index, limit) {
    let skip = index*limit;
    this.itemSrv.getReceipts(from, to, skip, limit).subscribe((response) => {
      this.itemDataSource.data = response.docs;
      this.paginator.length = response.total;
      this.paginator.pageIndex = index; 
      this.revenue = response.revenue;
      this.quantity = response.quantity;
      this.profit = response.revenue - response.cost;
    });
  }

  public onPageChance($event) {
    console.log('change page');
    this.pageSetting.pageSize = $event.pageSize;
    this.pageSetting.index = $event.pageIndex;
    this.queryMap[this.pageSetting.currentQuery]($event.pageIndex, $event.pageSize);
  }

  public onDownload(){
    // let category = this.pageSetting.category._id?this.pageSetting.category.name:null;
    this.itemSrv.downloadReceipts(this.pageSetting.from, this.pageSetting.to);
  }

  public updateReceipt(row){
    this.dataProvider.updateReceipt = row;
    this.router.navigate(['/', 'updateReceiptPage', row._id]);
  }
}
