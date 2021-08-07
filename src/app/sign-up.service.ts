import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getUniversities(): Observable<string[]> {
   return this.http.get<string[]>("assets/data/universities.json");
  }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>("assets/data/countries.json");
  }

  submitForm(formData: {}): Promise<any> {
    return this.firestore.collection('participants').add(formData);
  }

  async uploadCV(cv: File): Promise<string> {
    const fileName = Date.now().toString() + "_" + cv.name;
    const ref = this.storage.ref(fileName);
    const task = await ref.put(cv);
    return fileName;
  }

}
