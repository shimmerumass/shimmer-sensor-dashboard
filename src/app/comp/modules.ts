import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComp } from './auth-comp/auth-comp';
import { HeaderComp } from './header-comp/header-comp'; 
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AgGridAngular } from 'ag-grid-angular'; 
import { FileViewerComp } from './file-viewer-comp/file-viewer-comp';


@NgModule({
  declarations: [AuthComp, HeaderComp, FileViewerComp],
  imports: [CommonModule, AmplifyAuthenticatorModule, AgGridAngular],
  exports: [AuthComp, HeaderComp, FileViewerComp]
})
export class CompModule {}
