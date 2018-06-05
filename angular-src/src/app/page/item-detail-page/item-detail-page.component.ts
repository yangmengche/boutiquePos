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
  public item: ItemModel;
  private returnPath: string;
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
        });
      }
      if('ret' in params){
        this.returnPath = params['ret'];
      }else{
        this.returnPath = null;
      }
    });    
  }

  public onBack(){
    if(this.returnPath){
      this.router.navigate(['/', 'itemPage', this.returnPath]);
    }else{
      this.router.navigate(['/', 'itemPage']);
    }
  }
}
