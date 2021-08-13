import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {environment} from "../../environments/environment";

interface UNIVERSITY {
  entity: string,
  university: string
}

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient, private firestore: AngularFirestore, private storage: AngularFireStorage) {
    if (!environment.production) this.storage.storage.useEmulator('localhost', 9199);
  }

  getUniversities(): Observable<UNIVERSITY[]> {
   return this.http.get<UNIVERSITY[]>("assets/data/universities.json");
  }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>("assets/data/countries.json");
  }

  async submitForm(formData: any): Promise<any> {
    return this.firestore.collection('participants').doc(formData.email).set(formData);
  }

  async uploadCV(cv: File): Promise<string> {
    const fileName = Date.now().toString() + "_" + cv.name;
    const ref = this.storage.ref(fileName);
    await ref.put(cv);
    return fileName;
  }

  async checkDuplicateEmail(email: string): Promise<Boolean> {
    return false;
    let doc = await this.firestore.collection('participants').doc(email).get().toPromise();
    return doc.exists;
  }
}
