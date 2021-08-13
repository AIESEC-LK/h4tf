import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {LoginComponent} from "./login/login.component";
import {ViewComponent} from "./participants/view/view.component";

const routes: Routes = [
  { path: '', component: SignUpComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up/:entity', component: SignUpComponent },
  { path: 'participants/:email', component: ViewComponent },
  { path: 'participants', component: ParticipantsComponent },
  { path: 'logout', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
