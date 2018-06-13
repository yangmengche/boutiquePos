import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: Http) { }

  private serverApi = window.location.origin;

  public getHistogramData(from: Date, to: Date, group: string){
    let URI = `${this.serverApi}/receipt/histogram`;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify({
      "date": {
        "min": from? from.getTime(): null,
        "max": to? to.getTime(): null
      },
      "group":group
    });    
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }

  public getPieData(from: Date, to: Date, group: string){
    let URI = `${this.serverApi}/receipt/pie`;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify({
      "date": {
        "min": from? from.getTime(): null,
        "max": to? to.getTime(): null
      },
      "group":group
    });    
    return this.http.post(URI, body, { headers: headers })
      .pipe(
        map(res => res.json())
      );
  }  
}
