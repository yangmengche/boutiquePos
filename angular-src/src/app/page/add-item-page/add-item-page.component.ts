import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemAddModel, SupplierModel } from '../../model/model';
import { ItemService } from '../../service/item.service';
import { SupplierService } from '../../service/supplier.service';


@Component({
  selector: 'app-add-item-page',
  templateUrl: './add-item-page.component.html',
  styleUrls: ['./add-item-page.component.css'],
})
export class AddItemPageComponent implements OnInit {

  private newItem: ItemAddModel;
  private suppliers: SupplierModel[];
  constructor(
    private itemSrv: ItemService,
    private supplierSrv: SupplierService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) { }

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
    this.router.navigate(['/', 'scanPage']);
  }
}
