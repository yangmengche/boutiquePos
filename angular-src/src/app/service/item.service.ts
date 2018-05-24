import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { ItemModel, ItemAddModel } from '../model/model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: Http) { }

  private serverApi = environment.apiUrl;

  public getAllLists(): Observable<ItemModel[]> {

    let URI = `${this.serverApi}/item/`;
    return this.http.get(URI)
      .pipe(
        map(res => res.json()),
        // map(res => {return{ 'name':res.name, 'type':SupplierService.typeMap[res.type], 'shareRate':res.shareRate}),
        map(res => <ItemModel[]>res)
      )
  }

  public addItem(item: ItemAddModel) {
    let URI = `${this.serverApi}/item/create`;
    let headers = new Headers;
    let body = JSON.stringify({
      code: item.code,
      name: item.name,
      pic: item.pic,
      supplierID: item.supplierID,
      category: item.category,
      size: item.size,
      cost: item.cost,
      listPrice: item.listPrice,
      marketPrice: item.marketPrice
    });
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
