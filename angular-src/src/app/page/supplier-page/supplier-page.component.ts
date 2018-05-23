import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../service/supplier.service';
import { SupplierModel } from '../../model/supplierModel';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-supplier-page',
  templateUrl: './supplier-page.component.html',
  styleUrls: ['./supplier-page.component.css']
})
export class SupplierPageComponent implements OnInit {
  static typeMap = {
    'CONSIGNMENT': '寄賣',
    'BUYOUT': '賣斷'
  }
  // private suppliers: SupplierModel[] = [];
  supplierDataSource = new MatTableDataSource<any>();

  constructor(private supplierSrv: SupplierService) { }

  ngOnInit() {
    this.LoadLists();
  }

  public async LoadLists() {
    this.supplierSrv.getAllLists().subscribe((response) =>{
      console.log(response);
      response.forEach(supplier=>supplier.type = SupplierPageComponent.typeMap[supplier.type]);
      console.log(response);
      this.supplierDataSource.data = response;
    }); 
  }

  // public onAddSupplier(newSupplier) {
  //   this.suppliers = this.suppliers.concat(newSupplier);
  // }
  
  //deleteList. The deleted list is being filtered out using the .filter method
  // public deleteList(list: List) {
  //   this.listServ.deleteList(list._id).subscribe(response => this.lists = this.lists.filter(lists => lists !== list), )
  // }

}
