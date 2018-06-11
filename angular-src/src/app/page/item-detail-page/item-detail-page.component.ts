import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { SupplierService } from '../../service/supplier.service';
import { ItemModel, SupplierModel } from '../../model/model';
import { SIZE } from '../../model/def';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'app-item-detail-page',
  templateUrl: './item-detail-page.component.html',
  styleUrls: ['./item-detail-page.component.css']
})
export class ItemDetailPageComponent implements OnInit {
  public suppliers: SupplierModel[];
  public categories: string[];
  public sizes = SIZE;
  public uploadInput: EventEmitter<UploadInput>;

  public item: ItemModel;
  private returnPath: string;
  constructor(
    private itemSrv: ItemService,
    private supplierSrv: SupplierService,
    private router: Router,
    private actRoute: ActivatedRoute    
  ) { 
    this.uploadInput = new EventEmitter<UploadInput>(); 
  }

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
    this.supplierSrv.getSuppliers().subscribe((response) =>{
      this.suppliers = response;
    });
    this.itemSrv.getCategories().subscribe((response)=>{
      this.categories = response;
    });    
  }

  public onBack(){
    if(this.returnPath){
      this.router.navigate(['/', 'itemPage', this.returnPath]);
    }else{
      this.router.navigate(['/', 'itemPage']);
    }
  }

  public onChange(){
    this.itemSrv.updateItem(this.item).subscribe((response)=>{
      if(this.returnPath){
        this.router.navigate(['/', 'itemPage', this.returnPath]);
      }else{
        this.router.navigate(['/', 'itemPage']);
      }      
    });    
  }

  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      const event: UploadInput = {
        type: 'uploadAll',
        url: '/upload/image',
        method: 'POST'
      };
      this.uploadInput.emit(event);    
    }else if (output.type === 'done'){
      if(output.file.response.url){
        this.item.pic = output.file.response.url;
      }
    }
  }
}
