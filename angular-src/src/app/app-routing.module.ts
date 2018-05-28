import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemPageComponent } from './page/item-page/item-page.component';
import {AddItemPageComponent} from './page/add-item-page/add-item-page.component';
import { SalePageComponent } from './page/sale-page/sale-page.component';
import { StockPageComponent } from './page/stock-page/stock-page.component';
import { ReportPageComponent } from './page/report-page/report-page.component';
import { ChartPageComponent } from './page/chart-page/chart-page.component';
import { SupplierPageComponent } from './page/supplier-page/supplier-page.component';
import { CategoryPageComponent } from './page/category-page/category-page.component';
import { AccountPageComponent } from './page/account-page/account-page.component';
import { ScanPageComponent } from './page/scan-page/scan-page.component';

const routes: Routes = [
  { path: 'itemPage', component: ItemPageComponent },
  { path: 'addItemPage', component: AddItemPageComponent },
  { path: 'addItemPage/:code', component: AddItemPageComponent },
  { path: 'salePage', component: SalePageComponent },
  { path: 'stockPage', component: StockPageComponent },
  { path: 'reportPage', component: ReportPageComponent },
  { path: 'chartPage', component: ChartPageComponent },
  { path: 'supplierPage', component: SupplierPageComponent },
  { path: 'categoryPage', component: CategoryPageComponent },
  { path: 'accountPage', component: AccountPageComponent },
  { path: 'scanPage/:ret', component: ScanPageComponent },
  { path: '', redirectTo: 'itemPage', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }