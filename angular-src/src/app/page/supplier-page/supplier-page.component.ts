import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { SupplierService } from '../../service/supplier.service';
import { SupplierModel } from '../../model/model';
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
  private supplierDataSource = new MatTableDataSource<any>();
  private bAdd = true;
  private newSupplier: SupplierModel;

  constructor(private supplierSrv: SupplierService) { }

  ngOnInit() {
    this.LoadLists();
    this.initNewSupplier();
  }

  private initNewSupplier(){
    this.newSupplier = {
      name: '',
      type: '',
      shareRate: null
    }        
  }

  public async LoadLists() {
    this.supplierSrv.getAllLists().subscribe((response) =>{
      response.forEach(supplier=>supplier.type = SupplierPageComponent.typeMap[supplier.type]);
      this.supplierDataSource.data = response;
    }); 
  }

  public onAddClick(){
    this.bAdd = false;
  }

  // @Output() addSupplier: EventEmitter<SupplierModel> = new EventEmitter<SupplierModel>();
  public onSubmit() {
    this.supplierSrv.addSupplier(this.newSupplier).subscribe(
      response => {
        if (response.id){
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
