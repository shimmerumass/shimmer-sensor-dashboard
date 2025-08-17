import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { CompModule } from '../comp/modules';
import { HomePage } from './home-page/home-page';
import { UserOpsPage } from './user-ops/user-ops';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'user-ops', component: UserOpsPage }
];

@NgModule({
  declarations: [LoginPage, HomePage, UserOpsPage],
  imports: [CommonModule, CompModule, RouterModule.forChild(routes), FormsModule],
  exports: [LoginPage, HomePage, UserOpsPage]
})
export class PagesModule {}
