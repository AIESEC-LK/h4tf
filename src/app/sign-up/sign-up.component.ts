import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignUpService} from "../sign-up.service";
import {Observable} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {map, startWith} from 'rxjs/operators';

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
    first_name: new FormControl(),
    last_name: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    from: new FormControl(),
    university: new FormControl(),
    country: new FormControl(),
    year: new FormControl(),
    interest: new FormControl(),
    cv: new FormControl()
  });

  formData = {
    first_name: null as null | string,
    last_name: null as null | string,
    email: null as null | string,
    phone: null as null | string,
    from: "local" as string,
    university: null as null | string,
    country: null as null | string,
    interest: null as null | string,
    cv: ""
  }

  constructor(private http: HttpClient, private signUpService: SignUpService) {
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
    if (file) {
      this.formData.cv = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
    }
  }

  submitForm() {
    this.signUpService.submitForm(this.form.value).subscribe(data => {
      console.log(data)
    });
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
