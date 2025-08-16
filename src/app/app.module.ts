import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { CompModule } from './comp/modules';

// Components

@NgModule({
  declarations: [
  ],
  imports: [BrowserModule, AmplifyAuthenticatorModule, CompModule],
  providers: [],
  bootstrap: []
})
export class AppModule {}