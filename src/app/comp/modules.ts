import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComp } from './auth-comp/auth-comp';
import { HeaderComp } from './header-comp/header-comp'; 
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AgGridAngular } from 'ag-grid-angular'; 


@NgModule({
  declarations: [AuthComp, HeaderComp],
  imports: [CommonModule, AmplifyAuthenticatorModule, AgGridAngular],
  exports: [AuthComp, HeaderComp]
})
export class CompModule {}
