import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {environment} from "../../environments/environment";

interface UNIVERSITY {
  entity: string,
}

@Injectable({
  providedIn: 'root'
})
export class CompaniesAddService {

  constructor(private http: HttpClient, private firestore: AngularFirestore, private storage: AngularFireStorage) {
    if (!environment.production) this.storage.storage.useEmulator('localhost', 9199);
  }

  getEntities(): Observable<string[]> {
    return this.http.get<string[]>("assets/data/entities.json");
  }

  async submitForm(formData: any): Promise<any> {
    return this.firestore.collection('companies').doc(formData.company_name).set(formData);
  }

  async checkDuplicateCompany(company_name: string): Promise<Boolean> {
    return false;
    let doc = await this.firestore.collection('companies').doc(company_name).get().toPromise();
    return doc.exists;
  }
}
