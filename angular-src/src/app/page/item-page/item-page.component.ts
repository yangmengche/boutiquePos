import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { ItemModel } from '../../model/model';
import { MatTableDataSource, MatPaginator} from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {

  private itemDataSource = new MatTableDataSource<any>();
  private pageSize = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private itemSrv: ItemService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.itemDataSource.paginator = this.paginator;
    this.LoadLists();
  }

  public async LoadLists() {
    this.itemSrv.getAllItems().subscribe((response) => this.itemDataSource.data = response);
  }

  public onRowClick(row) {
    this.router.navigate(['/', 'itemDetailPage', row._id]);
  }
  public onAddItem() {
    this.router.navigate(['/', 'addItemPage']);
  }

}
