import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SupplierViewComponent } from './views/supplier-view/supplier-view.component';
import { SupplierService } from './services/supplier.service';
import { SupplierElemComponent } from './elements/add-supplier/add-supplier.component';

@NgModule({
  declarations: [
    AppComponent,
    SupplierViewComponent,
    SupplierElemComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [SupplierService],
  bootstrap: [AppComponent]
})
export class AppModule { }
