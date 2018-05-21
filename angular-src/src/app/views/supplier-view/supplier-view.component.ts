import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { SupplierModel } from '../../models/supplierModel';

@Component({
  selector: 'app-supplier-view',
  templateUrl: './supplier-view.component.html',
  styleUrls: ['./supplier-view.component.css']
})
export class SupplierViewComponent implements OnInit {

  private suppliers: SupplierModel[] = [];

  constructor(private supplierSrv: SupplierService) { }

  ngOnInit() {
    this.LoadLists();
  }

  public LoadLists() {
    this.supplierSrv.getAllLists().subscribe(response => this.suppliers = response)
  }

  public onAddSupplier(newSupplier) {
    this.suppliers = this.suppliers.concat(newSupplier);
  }
  
  //deleteList. The deleted list is being filtered out using the .filter method
  // public deleteList(list: List) {
  //   this.listServ.deleteList(list._id).subscribe(response => this.lists = this.lists.filter(lists => lists !== list), )
  // }

}
