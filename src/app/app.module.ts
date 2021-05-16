import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from '../pages/home/home.component';
import {SideNavComponent} from "../components/side-nav/side-nav.component";
import {ArtBoardComponent} from "../components/art-board/art-board.component";
import {NavCardComponent} from "../components/nav-card/nav-card.component";
import {XdInputComponent} from "../components/xd-input/xd-input.component";
import {FormsModule} from "@angular/forms";
import {ColorPickerModule} from "ngx-color-picker";
import {XdColorPickerComponent} from "../components/xd-color-picker/xd-color-picker.component";
import {XdSelectComponent} from "../components/xd-select/xd-select.component";
import {XdCheckboxComponent} from "../components/xd-checkbox/xd-checkbox.component";
import {XdFileUploadComponent} from "../components/xd-file-upload/xd-file-upload.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SideNavComponent,
    NavCardComponent,
    ArtBoardComponent,
    XdInputComponent,
    XdColorPickerComponent,
    XdSelectComponent,
    XdCheckboxComponent,
    XdFileUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
