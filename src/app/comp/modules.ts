import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AgGridModule } from 'ag-grid-angular';

import { AuthComp } from './auth-comp/auth-comp';
import { HeaderComp } from './header-comp/header-comp';
import { FilesGrid } from './files-grid/files-grid';
import { FileViewerComp } from './file-viewer-comp/file-viewer-comp';

@NgModule({
  declarations: [AuthComp, HeaderComp, FilesGrid, FileViewerComp],
  imports: [CommonModule, AmplifyAuthenticatorModule, AgGridModule],
  exports: [AuthComp, HeaderComp, FilesGrid, FileViewerComp]
})
export class CompModule {}
