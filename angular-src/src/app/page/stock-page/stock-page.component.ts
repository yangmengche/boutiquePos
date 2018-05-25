import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ItemModel } from '../../model/model'
import { ItemService } from '../../service/item.service';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.css']
})
export class StockPageComponent implements OnInit {
  private item: ItemModel;
  private quantity: number = 0;
  constructor(
    private router: Router,
    private itemSrc: ItemService
  ) { }

  ngOnInit() {
    this.item = {
      _id: '',
      code: '',
      name: '',
      pic: '',
      supplierID: {
        _id: '',
        name: ''
      },
      category: '',
      size: '',
      cost: 0,
      listPrice: 0,
      marketPrice: 0,
      stock: 0
    }
  }

  public onScan() {
    this.router.navigate(['/scanPage', '/stockPage']);
  }

  public queryItem() {
    this.itemSrc.getItemByCode(this.item.code).subscribe(res => {
      console.log(res);
      if (res.length > 0) {
        this.item = res[0];
      }
    })
  }

  public stockItem(){
    this.itemSrc.stockItem(this.item._id, this.quantity).subscribe(res => {
      console.log(res);
      if (res.nModified > 0) {
        this.queryItem();
      }
    })    
  }

}
