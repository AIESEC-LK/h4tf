import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SignUpService} from "../sign-up/sign-up.service";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, startWith} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";
import {ActivatedRoute} from "@angular/router";
import {AngularFireFunctions} from "@angular/fire/functions";

interface UNIVERSITY {
  entity: string,
  university: string
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  countries = {
    raw: [] as string[],
    filtered: null as null | Observable<string[]>
  };

  form = new FormGroup({
    country: new FormControl(),
    paymentKey: new FormControl(),
    email: new FormControl()
  });

  custom_fields = {
    custom_payment: true
  }

  custom_fields_b64: string;

  constructor(private signUpService: SignUpService, private dialog: MatDialog, private route: ActivatedRoute,
              private fns: AngularFireFunctions) {
    let objJsonStr = JSON.stringify(this.custom_fields);
    this.custom_fields_b64 = btoa(objJsonStr);
    console.log(this.custom_fields_b64);
  }

  async ngOnInit(): Promise<void> {
    if (!this.route.snapshot.paramMap.get("email")) return;
    const email = <string>this.route.snapshot.paramMap.get("email");
    this.form.get("email")?.setValue(email);

    await this.getPaymentKey();

    this.signUpService.getCountries().subscribe((data: string[]) => {
      this.countries.raw = data;
    });

    // @ts-ignore
    this.countries.filtered = this.form.get("country").valueChanges
      .pipe(
        startWith(''),
        map((value: any) => this._filter(value, this.countries.raw))
      );
  }

  async submitForm(form: any) {
    let loadingDialog = this.dialog.open(DialogComponent, {data: {type: "loading"}});
    try {
      form.submit();
    } catch (err){
      this.dialog.open(DialogComponent, {
        data: {
          type: "error",
          title: "ERROR",
          message: err
        }
      })
    } finally {
      loadingDialog.close();
    }
    return;
  }

  public async getPaymentKey() {
    const callable = this.fns.httpsCallable('getPaymentKey');
    const paymentKey =  await callable({email: this.form.get("email")?.value}).toPromise();
    this.form.get("paymentKey")?.setValue(paymentKey);
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
