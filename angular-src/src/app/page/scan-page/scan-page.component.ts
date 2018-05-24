import { Component, OnInit } from '@angular/core';
import * as Quagga from 'quagga';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.css']
})
export class ScanPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        // target: document.querySelector('#yourElement')    // Or '#yourElement' (optional)
      },
      decoder: {
        readers: ["code_128_reader"]
      }
    }, function (err) {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });
    Quagga.onProcessed(this.onProcessed);
    Quagga.onDetected(this.onDetected);
  }

  public onProcessed(data){
    console.log('on processed');
  }

  public onDetected(data){
    console.log('on detected');
  }

}
