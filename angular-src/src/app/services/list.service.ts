/*list.service.ts*/

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { List } from '../models/list'

// import 'rxjs/add/operator/map';

@Injectable()
export class ListService {

  constructor(private http: Http) { }

  private serverApi = 'http://localhost:1688';

  public getAllLists(): Observable<List[]> {

    let URI = `${this.serverApi}/supplier/`;
    return this.http.get(URI)
      .pipe(
        map(res => res.json()),
        map(res => <List[]>res)
      )
  }

  public addList(list: List) {
    let URI = `${this.serverApi}/supplier/create`;
    let headers = new Headers;
    let body = JSON.stringify({ name: list.name, type: list.type, shareRate: list.shareRate });
    console.log(body);
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  // public deleteList(listId: string) {
  //   let URI = `${this.serverApi}/bucketlist/${listId}`;
  //   let headers = new Headers;
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.delete(URI, { headers })
  //     .map(res => res.json());
  // }
}