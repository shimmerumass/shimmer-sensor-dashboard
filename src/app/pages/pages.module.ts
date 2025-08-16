import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './login-page/login-page';
import { CompModule } from '../comp/modules';
import { HomePage } from './home-page/home-page';

@NgModule({
  declarations: [LoginPage, HomePage],
  imports: [CommonModule, CompModule],
  exports: [LoginPage, HomePage]
})
export class PagesModule {}
