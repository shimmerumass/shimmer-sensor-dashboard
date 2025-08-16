import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComp } from './auth-comp/auth-comp';
import { HeaderComp } from './header-comp/header-comp'; 
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';



@NgModule({
  declarations: [AuthComp, HeaderComp],
  imports: [CommonModule, AmplifyAuthenticatorModule],
  exports: [AuthComp, HeaderComp]
})
export class CompModule {}
