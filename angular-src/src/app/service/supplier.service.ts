import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { SupplierModel } from '../model/model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private http: Http) { }

  private serverApi = environment.apiUrl;

  public getSuppliers(): Observable<SupplierModel[]> {

    let URI = `${this.serverApi}/supplier/`;
    return this.http.get(URI)
      .pipe(
        map(res => res.json()),
        // map(res => {return{ 'name':res.name, 'type':SupplierService.typeMap[res.type], 'shareRate':res.shareRate}),
        map(res => <SupplierModel[]>res)
      )
  }

  public addSupplier(supplier: SupplierModel) {
    let URI = `${this.serverApi}/supplier/create`;
    let headers = new Headers;
    let body = JSON.stringify({ name: supplier.name, type: supplier.type, shareRate: supplier.shareRate });
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
