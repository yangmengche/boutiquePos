import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';
import { SupplierModel } from '../../model/model';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { SUPPLIER_TYPE} from '../../model/def';

@Component({
  selector: 'app-supplier-page',
  templateUrl: './supplier-page.component.html',
  styleUrls: ['./supplier-page.component.css']
})
export class SupplierPageComponent implements OnInit {
  private typeMap = SUPPLIER_TYPE;
  // private suppliers: SupplierModel[] = [];
  private supplierDataSource = new MatTableDataSource<any>();
  private bAdd = true;
  private newSupplier: SupplierModel;

  constructor(private supplierSrv: SupplierService) { }

  ngOnInit() {
    this.LoadLists();
    this.initNewSupplier();
  }

  private initNewSupplier() {
    this.newSupplier = {
      name: '',
      type: '',
      shareRate: null
    }
  }

  public async LoadLists() {
    this.supplierSrv.getSuppliers().subscribe((response) => {
      // response.forEach(supplier=>supplier.type = this.typeMap[supplier.type]);
      this.supplierDataSource.data = response;
    });
  }

  public onAddClick() {
    this.bAdd = false;
  }

  // @Output() addSupplier: EventEmitter<SupplierModel> = new EventEmitter<SupplierModel>();
  public onSubmit() {
    console.log(this.newSupplier);
    this.supplierSrv.addSupplier(this.newSupplier).subscribe(
      response => {
        if (response.id) {
          this.LoadLists();
          this.initNewSupplier();
          // this.addSupplier.emit(this.newSupplier);
        }
        this.bAdd = true;
      },
    );
  }

  public onAddSupplier(newSupplier) {
    this.LoadLists();
  }

  //deleteList. The deleted list is being filtered out using the .filter method
  // public deleteList(list: List) {
  //   this.listServ.deleteList(list._id).subscribe(response => this.lists = this.lists.filter(lists => lists !== list), )
  // }

}
