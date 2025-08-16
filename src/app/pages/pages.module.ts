import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPage } from './login-page/login-page';
import { CompModule } from '../comp/modules';

@NgModule({
  declarations: [LoginPage],
  imports: [CommonModule, CompModule],
  exports: [LoginPage]
})
export class PagesModule {}
