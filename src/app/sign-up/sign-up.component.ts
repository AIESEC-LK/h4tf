import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignUpService} from "../sign-up.service";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
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

  formControls = {
    universitiesControl: new FormControl(),
    countriesControl: new FormControl()
  }

  formData = {
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    from: "local",
    university: null,
    country: null,
    interest: null,
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

    this.universities.filtered = this.formControls.universitiesControl.valueChanges
      .pipe(
        startWith(''),
        map((value: any) => this._filter(value, this.universities.raw))
      );

    this.countries.filtered = this.formControls.countriesControl.valueChanges
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

  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
