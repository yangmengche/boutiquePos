import { Component, OnInit } from '@angular/core';
import { ListService } from '../services/list.service';
import { List } from '../models/list';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {

  private lists: List[] = [];

  constructor(private listServ: ListService) { }

  ngOnInit() {
    this.LoadLists();
  }

  public LoadLists() {
    this.listServ.getAllLists().subscribe(response => this.lists = response)
  }

  public onAddList(newList) {
    this.lists = this.lists.concat(newList);
  }
  
  //deleteList. The deleted list is being filtered out using the .filter method
  // public deleteList(list: List) {
  //   this.listServ.deleteList(list._id).subscribe(response => this.lists = this.lists.filter(lists => lists !== list), )
  // }
}
