import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { CompModule } from './comp/modules';
import { PagesModule } from './pages/pages.module';
import { routes } from './app.routes';
import { App } from './app';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule, 
    RouterModule.forRoot(routes),
    AmplifyAuthenticatorModule, 
    CompModule, 
    PagesModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule {}