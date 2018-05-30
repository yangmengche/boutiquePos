import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { ItemModel } from '../../model/model';

@Component({
  selector: 'app-item-detail-page',
  templateUrl: './item-detail-page.component.html',
  styleUrls: ['./item-detail-page.component.css']
})
export class ItemDetailPageComponent implements OnInit {
  private item: ItemModel;
  constructor(
    private itemSrv: ItemService,
    private router: Router,
    private actRoute: ActivatedRoute    
  ) { }

  ngOnInit() {
    this.item={
      code: '',
      name: '',
      pic: '',
      supplierID: {
        _id: '',
        name: '',
      },
      category: '',
      size: '',
      cost: 0,
      listPrice: 0,
      marketPrice: 0,
      stock: 0
    }
    this.actRoute.params.subscribe(params => {
      if('id' in params){
        this.item._id = params['id'];
        this.itemSrv.getItemById(this.item._id).subscribe((res)=>{
          this.item = res[0];
        })
      }
    });    
  }

  public onBack(){
    this.router.navigate(['/', 'itemPage']);
  }
}
