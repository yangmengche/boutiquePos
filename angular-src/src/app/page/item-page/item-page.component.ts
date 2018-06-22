import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { SupplierService } from '../../service/supplier.service';
import { ItemModel, SupplierModel, CategoryModel } from '../../model/model';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort} from '@angular/material';
// import { Observable } from 'rxjs';
import { DataProviderService } from '../../service/data-provider.service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {
  private static headerList = ['pic', 'code', 'name', 'supplierID.name', 'size', 'marketPrice', 'stock', 'select'];
  public itemDataSource = new MatTableDataSource<any>();
  public pageSetting={
    index:0,
    pageSize: 10,
    category:null,
    supplierID: null,
    sort: 'code',
    dir: 'acs'
  }
  private pageEvent: PageEvent;
  public matHeader = ItemPageComponent.headerList;
  private returnPath: string;
  private bSelectMode = false;
  public suppliers: SupplierModel[];
  public categorys: CategoryModel[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  constructor(
    private itemSrv: ItemService,
    private supplierSrv: SupplierService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private dataProvider: DataProviderService
  ) { }

  ngOnInit() {
    // this.itemDataSource.paginator = this.paginator;  // don't bind pagination and data source if we want to do it in backend.
    this.actRoute.params.subscribe(params => {
      if('ret' in params){
        this.returnPath = params['ret'];
        // select mode
        this.bSelectMode = true;
      }
    });
    
    this.supplierSrv.getSuppliers().subscribe((response) =>{
      this.suppliers = response;
      this.suppliers.splice(0, 0, {'_id':'', 'name': '不限','type':'', 'shareRate':0});
    });
    this.itemSrv.getCategories().subscribe((response)=>{
      this.categorys = response;
      this.categorys.splice(0, 0, {'_id':'', 'name': '不限'});
    });
    this.initPageSetting();
    this.LoadLists(this.pageSetting.index*this.pageSetting.pageSize, this.pageSetting.pageSize);
    this.paginator.pageIndex = this.pageSetting.index;
    this.paginator.pageSize = this.pageSetting.pageSize;
    // this.itemDataSource.sort = this.sort;
  }

  ngOnDestroy(){
    this.dataProvider.itemPageSetting = this.pageSetting;
  }

  private initPageSetting(){
    this.pageSetting = this.dataProvider.itemPageSetting;
    this.pageSetting.index= this.pageSetting.index || 0;
    this.pageSetting.pageSize= this.pageSetting.pageSize || 10;
    this.pageSetting.category={};
    this.pageSetting.sort = this.pageSetting.sort || 'code';
    this.pageSetting.dir = this.pageSetting.dir || 'asc';
  }

  public async LoadLists(skip?, limit?) {
    let category = this.pageSetting.category._id?this.pageSetting.category.name:null;
    this.itemSrv.getItems(this.pageSetting.supplierID, category, skip, limit, this.pageSetting.sort, this.pageSetting.dir).subscribe((response) =>{
      this.itemDataSource.data = response.docs;
      this.paginator.length = response.total;
    });
  }

  public onRowClick(row) {
    if(this.bSelectMode){
      this.router.navigate([this.returnPath, row.code]);
    }
  }
  public onAddItem() {
    this.router.navigate(['/', 'addItemPage']);
  }

  public onPageChance($event){
    // two-way binding not work
    this.pageSetting.pageSize = $event.pageSize;
    this.pageSetting.index = $event.pageIndex;
    this.LoadLists($event.pageIndex*$event.pageSize, $event.pageSize);
  }

  public selectItem(row){
    this.dataProvider.item = row;
    if(this.returnPath){
      this.router.navigate(['/', 'itemDetailPage', this.returnPath, row._id]);
    }else{
      this.router.navigate(['/', 'itemDetailPage', row._id])
    }    
  }

  public onSelectChanged(event){
    this.pageSetting.index=0;
    this.LoadLists(this.pageSetting.index*this.pageSetting.pageSize, this.pageSetting.pageSize);
  }

  public sortData($event){
    console.log($event);
    this.pageSetting.sort = $event.active;
    this.pageSetting.dir = $event.direction;
    this.LoadLists(this.pageSetting.index*this.pageSetting.pageSize, this.pageSetting.pageSize);
  }



  public onDownlad(){
    let category = this.pageSetting.category._id?this.pageSetting.category.name:null;
    this.itemSrv.downloadItems(this.pageSetting.supplierID, category, null, null, this.pageSetting.sort, this.pageSetting.dir);
  }
}
