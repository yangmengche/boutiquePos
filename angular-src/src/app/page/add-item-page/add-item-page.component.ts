import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemAddModel, SupplierModel } from '../../model/model';
import { ItemService } from '../../service/item.service';
import { SupplierService } from '../../service/supplier.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { SIZE } from '../../model/def';

@Component({
  selector: 'app-add-item-page',
  templateUrl: './add-item-page.component.html',
  styleUrls: ['./add-item-page.component.css'],
})
export class AddItemPageComponent implements OnInit {
  private newItem: ItemAddModel;
  private suppliers: SupplierModel[];
  // private options: UploaderOptions;
  // private formData: FormData;
  private files: UploadFile[];
  private uploadInput: EventEmitter<UploadInput>;
  // private humanizeBytes: Function;
  
  private categories: string[];
  private sizes = SIZE;
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
      marketPrice: 0
    };
    this.actRoute.params.subscribe(params => {
      if('code' in params){
        this.newItem.code = params['code'];
      }
    });
   
    this.supplierSrv.getSuppliers().subscribe((response) =>{
      this.suppliers = response;
    });
    this.itemSrv.getCategories().subscribe((response)=>{
      this.categories = response;
    });
  }
  public onSubmit() {
    console.log('on submit');
    this.itemSrv.addItem(this.newItem).subscribe(
      response => {
        if (response.id)
          // route to item page
          this.router.navigate(['/', 'itemPage']);
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
        method: 'POST',
        data: { foo: 'bar' }
      };
      this.uploadInput.emit(event);    
    }else if (output.type === 'done'){
      if(output.file.response.url){
        this.newItem.pic = output.file.response.url;
      }
    }
  }

  public onBack(){
    this.router.navigate(['/', 'itemPage']);
  }
  
  public onSelectFile(){

  }

  public onOpenCamera(){

  }
}
