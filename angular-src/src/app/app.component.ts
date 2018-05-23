import { Component, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  pageTitle: String = '';

  onPageChange(title: String, sideNav:MatSidenav ): void {
    console.log('change page: '+ title);
    this.pageTitle = title;
    sideNav.close();
  }
}
