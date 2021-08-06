import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { MatFileUploadModule } from 'angular-material-fileupload';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from "@angular/material/checkbox";


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatFileUploadModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
