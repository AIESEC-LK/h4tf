import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getUniversities(): Observable<string[]> {
   return this.http.get<string[]>("assets/data/universities.json");
  }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>("assets/data/countries.json");
  }

  submitForm(formData: {}): Promise<any> {
    return this.firestore.collection('participants').add(formData);
  }

}
