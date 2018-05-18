/*add-list.component.ts*/

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { List } from '../models/list';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})

export class AddListComponent implements OnInit {
  private newList :List;

  constructor(private listServ: ListService) { }

  ngOnInit() {
    this.newList = {
        name: '',
        type:'',
        shareRate: null
    }
  }

  @Output() addList: EventEmitter<List> = new EventEmitter<List>();
  public onSubmit() {
    this.listServ.addList(this.newList).subscribe(
        response=> {
            if(response.id)
               this.addList.emit(this.newList);
        },
    );

    }
}