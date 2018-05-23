import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatListModule, MatTableModule } from '@angular/material';
import { SupplierService } from './service/supplier.service';
import { SupplierPageComponent } from './page/supplier-page/supplier-page.component';
import { ItemPageComponent } from './page/item-page/item-page.component';
import { AccountPageComponent } from './page/account-page/account-page.component';
import { StockPageComponent } from './page/stock-page/stock-page.component';
import { SalePageComponent } from './page/sale-page/sale-page.component';
import { ReportPageComponent } from './page/report-page/report-page.component';
import { ChartPageComponent } from './page/chart-page/chart-page.component';


@NgModule({
  declarations: [
    AppComponent,
    SupplierPageComponent,
    ItemPageComponent,
    AccountPageComponent,
    StockPageComponent,
    SalePageComponent,
    ReportPageComponent,
    ChartPageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule    
  ],
  providers: [SupplierService],
  bootstrap: [AppComponent]
})
export class AppModule { }
