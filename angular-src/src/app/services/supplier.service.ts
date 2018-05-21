import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { SupplierModel } from '../models/supplierModel'
import { environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: Http) { }

  private serverApi = environment.apiUrl;

  public getAllLists(): Observable<SupplierModel[]> {

    let URI = `${this.serverApi}/supplier/`;
    return this.http.get(URI)
      .pipe(
        map(res => res.json()),
        map(res => <SupplierModel[]>res)
      )
  }

  public addSupplier(list: SupplierModel) {
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
