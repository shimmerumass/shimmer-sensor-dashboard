import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthComp } from './auth-comp/auth-comp';
import { HeaderComp } from './header-comp/header-comp';
import { FilesGrid } from './files-grid/files-grid';
import { FileViewerComp } from './file-viewer-comp/file-viewer-comp';
import { UserGridComponent } from './user-grid/user-grid';

@NgModule({
  declarations: [AuthComp, HeaderComp, FilesGrid, FileViewerComp, UserGridComponent],
  imports: [
    CommonModule,
    AmplifyAuthenticatorModule,
    AgGridModule,
    FormsModule,
    RouterModule
  ],
  exports: [AuthComp, HeaderComp, FilesGrid, FileViewerComp, UserGridComponent]
})
export class CompModule {}
