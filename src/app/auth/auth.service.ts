import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase/app";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {first} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private role = "unset";
  private entity?: string;
  private email?: string;

  constructor(public auth: AngularFireAuth, private dialog: MatDialog) {}

  async forceLogin(): Promise<void> {
    console.log("Authenticated?:", await this.isAuthenticated());
    if (await this.isAuthenticated() || await this.login()) {
      console.log("Claims:", (await (await this.getUser()).getIdTokenResult(true)).claims);
      return;
    }
    this.dialog.open(DialogComponent, {
      data: {
        type: "error",
        title: "Error logging in",
        message: "Unable to authenticate."
      }
    })
    throw "Unable to login";
  }

  async getUser(): Promise<firebase.User> {
    const authState = await this.auth.authState.pipe(first());
    const user = <firebase.User> await authState.toPromise();
    const tokenResult = await user.getIdTokenResult(true);
    this.role = tokenResult.claims['role'];
    this.entity = tokenResult.claims['entity'];
    this.email = tokenResult.claims['email'];
    console.log("Token Result Claims:", tokenResult.claims);
    if (this.role == undefined) {
      await new Promise(r => setTimeout(r, 5000));
      location.reload();
    }
    return user;
  }

  async logout(): Promise<void> {
    if (!await this.isAuthenticated()) return;
    try {
      await this.auth.signOut();
    } catch (e) {
      this.dialog.open(DialogComponent, {
        data: {
          type: "error",
          title: "Error logging out",
          message: e.message
        }
      })
      throw e;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    const logged = await this.auth.authState.pipe(first()).toPromise();
    return logged != null;
  }

  private async login(): Promise<boolean> {
    try {
      await this.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
      return true;
    } catch (e) {
      this.dialog.open(DialogComponent, {
        data: {
          type: "error",
          title: "Error logging in",
          message: e.message
        }
      })
      return false;
    }
  }

  getRole(): string { return <string>this.role;}
  getEntity(): string { return <string>this.entity;}
  getEmail(): string { return <string>this.email;}

}
