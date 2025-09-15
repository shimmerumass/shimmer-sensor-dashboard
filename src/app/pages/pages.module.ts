import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { CompModule } from '../comp/modules';
import { HomePage } from './home-page/home-page';
import { UserOpsPage } from './user-ops/user-ops';
import { DataOps } from './data-ops/data-ops';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'user-ops', component: UserOpsPage },
  { path: 'login', component: LoginPage },
  { path: 'data-ops', component: DataOps },
];

@NgModule({
  declarations: [LoginPage, HomePage, UserOpsPage, DataOps],
  imports: [CommonModule, CompModule, RouterModule.forChild(routes), FormsModule],
  exports: [RouterModule,LoginPage, HomePage, UserOpsPage, DataOps],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {}
