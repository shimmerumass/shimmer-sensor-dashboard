import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { CompModule } from '../comp/modules';
import { HomePage } from './home-page/home-page';

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'home', component: HomePage }
];

@NgModule({
  declarations: [LoginPage, HomePage],
  imports: [CommonModule, CompModule, RouterModule.forChild(routes)],
  exports: [LoginPage, HomePage]
})
export class PagesModule {}
