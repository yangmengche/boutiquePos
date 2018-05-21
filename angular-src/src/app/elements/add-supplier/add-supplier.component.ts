import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SupplierModel } from '../../models/supplierModel';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-elem',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class SupplierElemComponent implements OnInit {

  private newSupplier: SupplierModel;

  constructor(private supplierSrv: SupplierService) { }

  ngOnInit() {
    this.newSupplier = {
      name: '',
      type: '',
      shareRate: null
    }
  }

  @Output() addSupplier: EventEmitter<SupplierModel> = new EventEmitter<SupplierModel>();
  public onSubmit() {
    this.supplierSrv.addSupplier(this.newSupplier).subscribe(
      response => {
        if (response.id)
          this.addSupplier.emit(this.newSupplier);
      },
    );

  }

}
