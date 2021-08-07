import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  getUniversities(): Observable<string[]> {
   return this.http.get<string[]>("assets/data/universities.json");
  }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>("assets/data/countries.json");
  }

  submitForm(formData: {}): Observable<any> {
    console.log("sf");
    return this.http.post("/api/sign-up", formData);
  }
}
