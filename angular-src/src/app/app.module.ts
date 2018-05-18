import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AddListComponent } from './add-list/add-list.component';
import { ViewListComponent } from './view-list/view-list.component';
import { ListService } from './services/list.service';

@NgModule({
  declarations: [
    AppComponent,
    AddListComponent,
    ViewListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule    
  ],
  providers: [ListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
