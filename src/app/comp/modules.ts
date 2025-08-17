import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthComp } from './auth-comp/auth-comp';
import { HeaderComp } from './header-comp/header-comp';
import { FilesGrid } from './files-grid/files-grid';
import { UserGridComponent } from './user-grid/user-grid';

@NgModule({
  declarations: [AuthComp, HeaderComp, FilesGrid, UserGridComponent],
  imports: [
    CommonModule,
    AmplifyAuthenticatorModule,
    AgGridModule,
    FormsModule,
    RouterModule
  ],
  exports: [AuthComp, HeaderComp, FilesGrid, UserGridComponent]
})
export class CompModule {}
