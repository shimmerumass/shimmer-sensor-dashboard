import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComp } from './auth-comp/auth-comp';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { Header } from './header/header';


@NgModule({
  declarations: [AuthComp, Header],
  imports: [CommonModule, AmplifyAuthenticatorModule],
  exports: [AuthComp, Header]
})
export class CompModule {}
