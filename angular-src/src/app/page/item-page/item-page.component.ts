import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { ItemModel } from '../../model/model';
import { MatTableDataSource, MatPaginator, PageEvent} from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {

  private itemDataSource = new MatTableDataSource<any>();
  private pageSize = 10;
  private pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private itemSrv: ItemService,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.itemDataSource.paginator = this.paginator;  // don't bind pagination and data source if we want to do it in backend.
    this.LoadLists(0, this.pageSize);
  }

  public async LoadLists(skip?, limit?) {
    this.itemSrv.getItems(skip, limit).subscribe((response) =>{
      this.itemDataSource.data = response.docs;
      this.paginator.length = response.total;
    })
  }

  public onRowClick(row) {
    this.router.navigate(['/', 'itemDetailPage', row._id]);
  }
  public onAddItem() {
    this.router.navigate(['/', 'addItemPage']);
  }

  public onPageChance($event){
    console.log('change page');
    this.LoadLists($event.pageIndex*$event.pageSize, $event.pageSize);
  }

}
