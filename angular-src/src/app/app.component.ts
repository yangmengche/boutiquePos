import { Component, Output, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material';


// declare var Quagga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  pageTitle: String = '';

  ngOnInit() {
    this.pageTitle='品項';
  }

  onPageChange(title: String, sideNav: MatSidenav): void {
    console.log('change page: ' + title);
    this.pageTitle = title;
    sideNav.close();
  }
}
