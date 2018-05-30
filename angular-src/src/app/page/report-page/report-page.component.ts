import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ItemService } from '../../service/item.service';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit {

  private itemDataSource = new MatTableDataSource<any>();

  constructor(
    private itemSrv: ItemService,
  ) { }

  ngOnInit() {
    this.loadLists()
  }

  public async loadLists() {
    this.itemSrv.getReceipts().subscribe((response) =>{
      this.itemDataSource.data = response.docs;
    });
  }

  public getRevenue(){
    return this.itemDataSource.data.reduce((acc, item) => acc + item.pay, 0);
  }

  public getQuantity(){
    return this.itemDataSource.data.reduce((acc, item) => acc + item.quantity, 0);    
  }

  public onRowClick(row){

  }

}
