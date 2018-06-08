import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatSidenavModule, MatToolbarModule, MatIconModule,
  MatListModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, 
  MatChipsModule, MatPaginatorModule, MatDatepickerModule, MatSortModule
} from '@angular/material';
import { MatMomentDateModule} from '@angular/material-moment-adapter'

import { NgUploaderModule } from 'ngx-uploader';

import { SupplierService } from './service/supplier.service';
import { ItemService } from './service/item.service';
import { DataProviderService } from './service/data-provider.service';

import { SupplierPageComponent } from './page/supplier-page/supplier-page.component';
import { ItemPageComponent } from './page/item-page/item-page.component';
import { AccountPageComponent } from './page/account-page/account-page.component';
import { StockPageComponent } from './page/stock-page/stock-page.component';
import { SalePageComponent } from './page/sale-page/sale-page.component';
import { ReportPageComponent } from './page/report-page/report-page.component';
import { ChartPageComponent } from './page/chart-page/chart-page.component';
import { AddItemPageComponent } from './page/add-item-page/add-item-page.component';
import { ScanPageComponent } from './page/scan-page/scan-page.component';
import { CategoryPageComponent } from './page/category-page/category-page.component';
import { ItemDetailPageComponent } from './page/item-detail-page/item-detail-page.component';
import { SupplierTypePipe } from './pipe/supplier-type.pipe';
import { PayByPipe } from './pipe/pay-by.pipe';
import { ReportDetailPageComponent } from './page/report-detail-page/report-detail-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    SupplierPageComponent,
    ItemPageComponent,
    AccountPageComponent,
    StockPageComponent,
    SalePageComponent,
    ReportPageComponent,
    ChartPageComponent,
    AddItemPageComponent,
    ScanPageComponent,
    CategoryPageComponent,
    ItemDetailPageComponent,
    SupplierTypePipe,
    PayByPipe,
    ReportDetailPageComponent
  ],
  imports: [
    BrowserModule,
    NgUploaderModule,    
    HttpModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSortModule,
    NgxChartsModule
  ],
  providers: [SupplierService, ItemService, DataProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
