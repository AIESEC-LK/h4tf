import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  { path: 'sign-up/:entity', component: SignUpComponent },
  { path: 'participants', component: ParticipantsComponent },
  { path: 'logout', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
