import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import * as Quagga from 'quagga';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.css']
})
export class ScanPageComponent implements OnInit {
  private lastResult: String = '';
  private count: number = 0;
  constructor(private location: PlatformLocation, private router: Router, ) {
    location.onPopState(this.onLeave);
  }

  ngOnInit() {
    this.InitQuagga();
  }

  private InitQuagga() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        // target: document.querySelector('#yourElement')    // Or '#yourElement' (optional)
      },
      constraints: {
        width: 640,
        height: 480,
        facingMode: "environment",
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      decoder: {
        readers: ["code_128_reader"]
      },
      locate: true,
      frequency: 10,
    }, function (err) {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });
    Quagga.onProcessed(this.onProcessed.bind(this));
    Quagga.onDetected(this.onDetected.bind(this));
  }

  public onProcessed(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;
    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  }

  private stopQuagga() {
    Quagga.stop();
    Quagga.offProcessed(this.onProcessed);
    Quagga.offDetected(this.onDetected);
  }

  @Output() codeDetected: EventEmitter<String> = new EventEmitter<String>();

  public onDetected(result) {
    var code = result.codeResult.code;

    if (this.lastResult !== code) {
      this.lastResult = code;
      // send detected event
      this.codeDetected.emit(this.lastResult);
      this.stopQuagga();
      this.router.navigate(['/addItemPage', this.lastResult]);
    }
  }
  public onLeave() {
    this.stopQuagga();
  }

  public emitEvent() {
    this.lastResult = '123456789';
    // this.codeDetected.emit(this.lastResult);
    this.router.navigate(['/addItemPage', this.lastResult]);
  }
}
