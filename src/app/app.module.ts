import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { CompModule } from './comp/modules';
import { PagesModule } from './pages/pages.module';
import { App } from './app';
import { routes } from './app.routes';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule, 
    HttpClientModule,
    RouterModule.forRoot(routes),
    AmplifyAuthenticatorModule, 
    CompModule, 
    PagesModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule {}