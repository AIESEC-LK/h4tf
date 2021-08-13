import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {AngularFirestore} from "@angular/fire/firestore";
import {Participant} from "../interfaces/participant";
import {AngularFireStorage} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  constructor(private authService: AuthService, private firestore: AngularFirestore,  private storage: AngularFireStorage) { }

  async getParticipants(): Promise<{}[]> {
    await this.authService.forceLogin();
    let participantsDoc;
    if (["editor", "viewer"].includes(this.authService.getRole())) {
      participantsDoc = await this.firestore.firestore.collection('participants')
        .where('entity', '==', this.authService.getEntity());
    } else participantsDoc = await this.firestore.firestore.collection('participants')

    let result: {}[] = []
    const querySnapshot = await participantsDoc.get();
    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    })
    return result;
  }

  async getParticipant(email: string): Promise<Participant> {
    await this.authService.forceLogin();
    const participantDoc = await this.firestore.collection('participants').doc(email).ref.get();
    return <Participant>participantDoc.data();
  }

  async getCVDownloadUrl(filename: string): Promise<string> {
    const url = await this.storage.ref(filename).getDownloadURL().toPromise();
    console.log("CV URL", url);
    return url;
  }

  async changeStatus(email: string, status: string) {
    await this.authService.forceLogin();
    let changes = {};

    // @ts-ignore
    changes["status"] = status;
    // @ts-ignore
    changes[status + "Timestamp"] = new Date().toISOString();

    await this.firestore.collection('participants').doc(email).update(changes);
  }
}