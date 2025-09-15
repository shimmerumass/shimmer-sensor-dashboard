import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { CompModule } from '../comp/modules';
import { HomePage } from './home-page/home-page';
import { UserOpsPage } from './user-ops/user-ops';
import { FormsModule } from '@angular/forms';
import { DataOps } from './data-ops/data-ops';

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'user-ops', component: UserOpsPage },
  { path: 'login', component: LoginPage }
];

@NgModule({
  declarations: [LoginPage, HomePage, UserOpsPage, DataOps],
  imports: [CommonModule, CompModule, RouterModule.forChild(routes), FormsModule],
  exports: [RouterModule]
})
export class PagesModule {}
