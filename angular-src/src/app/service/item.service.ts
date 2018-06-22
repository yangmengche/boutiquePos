import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { ItemModel, ItemAddModel, ReceiptModel } from '../model/model'
import { environment } from '../../environments/environment'
import { isNull } from 'util'
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(
    private http: Http,
  ) { }

  private serverApi = window.location.origin;

  private fillNoImagePath(items) {
    let pattern = new RegExp(/^\/resource/);
    for (let i in items) {
      if (!pattern.test(items[i].pic)) {
        items[i].pic = '/resource/noImage.jpeg';
      }
    }
    return items;
  }
  public getItems(supplierID?: string, category?: string, skip?: number, limit?: number, sort?: string, dir?: string): Observable<any> {
    let URI = `${this.serverApi}/item/query`;
    let headers = new Headers;
    let body = JSON.stringify({
      "supplierID": supplierID,
      "category": category,
      "skip": skip,
      "limit": limit,
      "sort": sort,
      "dir": dir == "asc" ? 1 : -1
    });
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json()),
        map(res => { res.docs = this.fillNoImagePath(res.docs); return res; })
        // map(res => {return{ 'name':res.name, 'type':SupplierService.typeMap[res.type], 'shareRate':res.shareRate}),
        // map(res => <ItemModel[]>res)
      )
  }

  private downloadFile(res: any){
    let data = <Blob>res.blob();
    let filename = decodeURIComponent(res.headers.get('filename'));
    var blob = new Blob([data], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  public downloadItems(supplierID?: string, category?: string, skip?: number, limit?: number, sort?: string, dir?: string): any {
    let URI = `${this.serverApi}/download/item`;
    let headers = new Headers;
    let body = JSON.stringify({
      "supplierID": supplierID,
      "category": category,
      "skip": skip,
      "limit": limit,
      "sort": sort,
      "dir": dir == "asc" ? 1 : -1
    });
    headers.append('Content-Type', 'application/json');
    let options =  new RequestOptions({responseType: ResponseContentType.Blob});
    return this.http.post(URI, body, options).subscribe(data=> this.downloadFile(data)),err =>console.log(err.message);
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
      marketPrice: item.marketPrice,
      stock: item.stock
    });
    console.log(body);
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public updateItem(item: ItemModel) {
    let URI = `${this.serverApi}/item/update`;
    let headers = new Headers;
    let body = JSON.stringify({
      id: item._id,
      code: item.code,
      name: item.name,
      pic: item.pic,
      supplierID: item.supplierID,
      category: item.category,
      size: item.size,
      cost: item.cost,
      listPrice: item.listPrice,
      marketPrice: item.marketPrice,
      stock: item.stock
    });
    headers.append('Content-Type', 'application/json');
    return this.http.put(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public getItemByCode(code: String) {
    let URI = `${this.serverApi}/item` + `?code=` + code;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.get(URI, { headers: headers })
      .pipe(
        map(res => res.json()),
        map(this.fillNoImagePath)
      );
  }

  public getItemById(id: String) {
    let URI = `${this.serverApi}/item` + `?id=` + id;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.get(URI, { headers: headers })
      .pipe(
        map(res => res.json()),
        map(this.fillNoImagePath)
      );
  }

  public stockItem(id: string, quantity: number) {
    let URI = `${this.serverApi}/item/stock`;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify({
      itemID: id,
      quantity: quantity,
    });
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public getCategories() {
    let URI = `${this.serverApi}/category`;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.get(URI, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public addCategory(category) {
    let URI = `${this.serverApi}/category/create`;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify([{
      name: category
    }]);
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public deleteCategory(id: string) {
    let URI = `${this.serverApi}/category?id=` + id;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.delete(URI, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public addReceipt(receipt: ReceiptModel) {
    let URI = `${this.serverApi}/receipt/create`;
    let headers = new Headers;
    let bodyObj = {
      payBy: receipt.payBy,
      pay: receipt.pay,
      remark: receipt.remark,
      returnRefID: receipt.returnRefID,
      items: [],
      date: receipt.date
    };
    for (let i in receipt.items) {
      bodyObj.items.push({
        'itemID': receipt.items[i]._id,
        'salePrice': receipt.items[i].salePrice,
        'quantity': receipt.items[i].quantity
      })
    }
    let body = JSON.stringify(bodyObj);
    headers.append('Content-Type', 'application/json');
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public getReceipts(from?: Date, to?: Date, skip?: number, limit?: number) {
    let URI = `${this.serverApi}/receipt/query`;
    let headers = new Headers;
    let bodyObj = {
      skip: skip,
      limit: limit,
      date: {}
    };
    if (from) {
      bodyObj.date['min'] = from.getTime();
    }
    if (to) {
      bodyObj.date['max'] = to.getTime();
    }
    let body = JSON.stringify(bodyObj);
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
