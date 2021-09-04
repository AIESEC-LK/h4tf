import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFileUploadModule} from 'angular-material-fileupload';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {environment} from "../environments/environment";
import {SETTINGS} from '@angular/fire/firestore';
import {AngularFireModule} from "@angular/fire";
import { DialogComponent } from './dialog/dialog.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AngularFireFunctionsModule, USE_EMULATOR} from '@angular/fire/functions';
import {AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { LoginComponent } from './login/login.component';
import { SETTINGS as AUTH_SETTINGS, AngularFireAuthModule } from '@angular/fire/auth';
import "firebase/auth";
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { ParticipantsComponent } from './participants/participants.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ViewComponent } from './participants/view/view.component';
import { PaymentComponent } from './payment/payment.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatDatepickerModule} from "@angular/material/datepicker";

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    DialogComponent,
    LoginComponent,
    ParticipantsComponent,
    ViewComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
    MatCheckboxModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, "angular-auth-firebase"),
    MatDialogModule,
    MatProgressSpinnerModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MatTableModule,
    MatSortModule,
    NgxMatSelectSearchModule,
    MatTableExporterModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: SETTINGS,
      useValue: environment.production ? undefined : {
        host: 'localhost:8080',
        ssl: false
      }
    },
    { provide: USE_EMULATOR, useValue: environment.production? undefined : ['localhost', 5001] },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true} },
    { provide: BUCKET, useValue:  environment.production? 'h4tf-portal2.appspot.com' : 'h4tf-portal2.appspot.com' },
    { provide: AUTH_SETTINGS, useValue: { appVerificationDisabledForTesting: true } },
    { provide: USE_AUTH_EMULATOR, useValue: environment.production ? undefined : ['localhost', 9099] },
  ],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
