import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SaleModel } from '../../model/model';
import { MatTableDataSource } from '@angular/material';
import { ItemService } from '../../service/item.service';

@Component({
  selector: 'app-sale-page',
  templateUrl: './sale-page.component.html',
  styleUrls: ['./sale-page.component.css']
})
export class SalePageComponent implements OnInit {
  private saleItem: SaleModel;
  private itemDataSource = new MatTableDataSource<any>();

  constructor(
    private router: Router,
    private itemSrv: ItemService,
  ) { }

  ngOnInit() {
    this.saleItem = {
      _id: '',
      code: '',
      name: '',
      category: '',
      size: '',
      cost: 0,
      listPrice: 0,
      marketPrice: 0,
      quantity: 0
    }    
  }

  public onScan() {
    this.router.navigate(['/scanPage', '/stockPage']);
  }

  public onAddItem(){
    this.itemSrv.getItemByCode(this.saleItem.code).subscribe((res)=>{
      let data = this.itemDataSource.data;
      let item = res[0];
      data.push({
        _id: item._id,
        code: item.code,
        name: item.name,
        category: item.category,
        size: item.size,
        cost: item.cost,
        listPrice: item.listPrice,
        marketPrice: item.marketPrice,
        quantity: 1
      });
      this.itemDataSource.data=  data;
    });
  }
}
