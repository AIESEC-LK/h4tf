import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignUpService} from "../sign-up.service";
import {Observable} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, startWith} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  universities = {
    raw: [] as string[],
    filtered: null as null | Observable<string[]>
  };
  countries = {
    raw: [] as string[],
    filtered: null as null | Observable<string[]>
  };
  years = ["School Leaver", "1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

  form = new FormGroup({
    first_name: new FormControl(null, [Validators.required]),
    last_name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required,
      Validators.pattern('(^(0\\s*)([0-9]\\s*){8}[0-9]$)|^\\+([0-9]\\s*)*$')]),
    from: new FormControl(null, [Validators.required]),
    university: new FormControl(),
    country: new FormControl(),
    year: new FormControl(),
    interest: new FormControl(),
    consent: new FormControl(null,  [Validators.requiredTrue]),
    cv: new FormControl(),
    cv_filename: new FormControl()
  });

  formData = {
    cv: "",
    cv_file: null as null | File
  }

  constructor(private http: HttpClient, private signUpService: SignUpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.signUpService.getUniversities().subscribe(data => {
      this.universities.raw = data;
    });

    this.signUpService.getCountries().subscribe(data => {
      this.countries.raw = data;
    });

    // @ts-ignore
    this.universities.filtered = this.form.get("university").valueChanges
      .pipe(
        startWith(''),
        map((value: any) => this._filter(value, this.universities.raw))
      );

    // @ts-ignore
    this.countries.filtered = this.form.get("country").valueChanges
      .pipe(
        startWith(''),
        map((value: any) => this._filter(value, this.countries.raw))
      );
  }

  // @ts-ignore
  onFileSelected(event) {
    const file:File = event.target.files[0];
    this.formData.cv_file = file;
    if (file) {
      this.formData.cv = file.name;
    }
  }

  async submitForm() {
    let loadingDialog = this.dialog.open(DialogComponent, {data: {type: "loading"}});
    try {
      //if (!this.form.valid) throw "There was an error with your form";
      let fileName: string = "";
      if (this.formData.cv_file != null) fileName = await this.signUpService.uploadCV(<File>this.formData.cv_file);
      this.form.get("cv_filename")?.setValue(fileName);
      await this.signUpService.submitForm(this.form.value);

      this.dialog.open(DialogComponent, {
        data: {
          type: "success",
          title: "You have successfully signed up",
          message: "One of our representatives will be in touch with you shortly"
        }
      }).afterClosed().subscribe(() => {
        window.location.href = "https://aiesec.lk/h4tf"
      })

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

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
