import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignUpComponent} from "./sign-up/sign-up.component";
// import {CompaniesComponent} from "./companies/companies.component";
// import {CompaniesAddComponent} from "./companies-add/companies-add.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {LoginComponent} from "./login/login.component";
import {ViewComponent} from "./participants/view/view.component";
import {PaymentComponent} from "./payment/payment.component";

const routes: Routes = [
  { path: '', component: SignUpComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up/:entity', component: SignUpComponent },
  // { path: 'companies', component: CompaniesComponent },
  // { path: 'companies/add', component: CompaniesAddComponent },
  { path: 'participants/:email', component: ViewComponent },
  { path: 'participants', component: ParticipantsComponent },
  { path: 'pay/:email', component: PaymentComponent },
  { path: 'logout', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
