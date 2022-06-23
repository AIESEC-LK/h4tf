import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Company } from "../interfaces/company";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private authService: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  async getCompanies(): Promise<Company[]> {
    await this.authService.forceLogin();

    let companiesDoc;
    if (["editor", "viewer"].includes(this.authService.getRole())) {
      companiesDoc = await this.firestore.firestore.collection('companies')
        .where('entity', '==', this.authService.getEntity()).orderBy("lastModifiedTimestamp", 'desc');
    } else companiesDoc = await this.firestore.firestore.collection('companies').orderBy("lastModifiedTimestamp", 'desc')
    // companiesDoc = await this.firestore.firestore.collection('companies').orderBy("lastModifiedTimestamp", 'desc');

    let result: Company[] = []
    const querySnapshot = await companiesDoc.get();
    querySnapshot.forEach((doc) => {
      result.push(<Company>doc.data());
    })
    return result;
  }

  async getCompany(company_name: string): Promise<Company> {
    await this.authService.forceLogin();
    const companyDoc = await this.firestore.collection('companies').doc(company_name).ref.get();
    return <Company>companyDoc.data();
  }

  async getCVDownloadUrl(filename: string): Promise<string> {
    const url = await this.storage.ref(filename).getDownloadURL().toPromise();
    console.log("CV URL", url);
    return url;
  }

  async changeStatus(company_name: string, status: string) {
    await this.authService.forceLogin();
    let changes = {};

    // @ts-ignore
    changes["status"] = status;
    // @ts-ignore
    changes[status + "Timestamp"] = new Date().toISOString();

    await this.firestore.collection('companies').doc(company_name).update(changes);
  }

  getTimestamp(utc: string): string {
    if (utc == null) return "";
    let dt = new Date(utc);
    return (`${(dt.getFullYear()).toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`
    );
  }
}
