import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemAddModel, SupplierModel } from '../../model/model';
import { ItemService } from '../../service/item.service';
import { SupplierService } from '../../service/supplier.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { SIZE } from '../../model/def';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

@Component({
  selector: 'app-add-item-page',
  templateUrl: './add-item-page.component.html',
  styleUrls: ['./add-item-page.component.css'],
})
export class AddItemPageComponent implements OnInit {
  public newItem: ItemAddModel;
  public suppliers: SupplierModel[];
  public options: UploaderOptions;
  public categories: string[];
  public sizes = SIZE;  
  public uploadInput: EventEmitter<UploadInput>;

  private files: UploadFile[];
  private shareRate={};
  private returnPath: string;
  public createDate = moment();
  constructor(
    private itemSrv: ItemService,
    private supplierSrv: SupplierService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) { 
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>(); 
    // this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.newItem = {
      code: '',
      name: '',
      pic: '',
      supplierID: '',
      category: '',
      size: '', 
      cost: 0,
      listPrice: 0,
      marketPrice: 0,
      stock: 0
    };
    this.createDate = moment();
    this.actRoute.params.subscribe(params => {
      if('code' in params){
        this.newItem.code = params['code'];
      }
      if('ret' in params){
        this.returnPath = params['ret'];
      }else{
        this.returnPath = null;
      }
    });
   
    this.supplierSrv.getSuppliers().subscribe((response) =>{
      this.suppliers = response;
      for(let i in this.suppliers){
        if(this.suppliers[i].shareRate){
          this.shareRate[this.suppliers[i]._id] = this.suppliers[i].shareRate;
        }
      }
    });
    this.itemSrv.getCategories().subscribe((response)=>{
      this.categories = response;
    });
  }
  public onSubmit() {
    console.log('on submit');
    let now = moment();
    if(!this.createDate.isSame(now, 'day')){
      this.newItem.date = this.createDate.toDate();
      this.newItem.date.setHours(12, 0, 0, 0); // if user set sale date, set time to 12:00
    }    
    this.itemSrv.addItem(this.newItem).subscribe(
      response => {
        if (response.id)
          // route to back page
          if(this.returnPath){
            this.router.navigate([this.returnPath]);
          }else{
            this.router.navigate(['/itemPage']);
          }
      },
    );
  }
  public onScan(){
    console.log('go to scan page');
    this.router.navigate(['/scanPage', '/addItemPage']);
  }

  public fileChange(event){
    console.log(event);
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
        this.newItem.pic = output.file.response.url;
      }
    }
  }

  public onBack(){
    if(this.returnPath){
      this.router.navigate([this.returnPath]);
    }else{
      this.router.navigate(['/itemPage']);
    }
  }
  
  public onListPriceChanged(value: number){
    if(this.shareRate[this.newItem.supplierID]){
      this.newItem.cost = value* this.shareRate[this.newItem.supplierID];
    }
    this.newItem.marketPrice = this.newItem.listPrice;
  }

  public onSelectFile(){

  }

  public onOpenCamera(){

  }
}
