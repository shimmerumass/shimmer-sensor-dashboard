import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { CompModule } from './comp/modules';
import { PagesModule } from './pages/pages.module';

// Components

@NgModule({
  declarations: [],
  imports: [BrowserModule, AmplifyAuthenticatorModule, CompModule, PagesModule],
  providers: [],
  bootstrap: []
})
export class AppModule {}