import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../../model/model';
import { ItemService } from '../../service/item.service';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {
  private itemDataSource = new MatTableDataSource<any>();
  private newCategory:string;

  constructor(private itemSrv: ItemService) { }

  ngOnInit() {
    this.loadLists();
  }

  public loadLists() {
    this.itemSrv.getCategories().subscribe((response) =>this.itemDataSource.data = response);
  }

  public onAddCategory(){
    if(this.newCategory && this.newCategory.length > 0){
      this.itemSrv.addCategory(this.newCategory).subscribe((response)=>{
        if(response.ids.length > 0){
          this.loadLists();
          this.newCategory='';
        }
      });
    }
  }

  public deleteCategory(category){
    this.itemSrv.deleteCategory(category._id).subscribe((response)=>{
      if(response.nRemove > 0){
        this.loadLists();
      }
    });
  }
}
