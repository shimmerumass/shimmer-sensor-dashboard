import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComp } from './auth-comp/auth-comp';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';


@NgModule({
  declarations: [AuthComp],
  imports: [CommonModule, AmplifyAuthenticatorModule],
  exports: [AuthComp]
})
export class CompModule {}
