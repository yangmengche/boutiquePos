import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ItemService } from '../../service/item.service';
import { ItemModel } from '../../model/model';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {

  private itemDataSource = new MatTableDataSource<any>();

  constructor(private itemSrv: ItemService) { }

  ngOnInit() {
    this.LoadLists();
  }

  public async LoadLists() {
    this.itemSrv.getAllItems().subscribe((response) =>this.itemDataSource.data = response);
  }
}
