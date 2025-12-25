import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { CompModule } from '../comp/modules';
import { HomePage } from './home-page/home-page';
import { UserOpsPage } from './user-ops/user-ops';
import { DataOps } from './data-ops/data-ops';

import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { AgGridModule } from 'ag-grid-angular';
import { LatestFilesPage } from './latest-files/latest-files';
import { DashboardPage } from './dashboard/dashboard';


const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'user-ops', component: UserOpsPage },
  { path: 'login', component: LoginPage },
  { path: 'data-ops', component: DataOps },
  { path: 'latest-files', component: LatestFilesPage },
  { path: 'dashboard', component: DashboardPage },
];


@NgModule({
  declarations: [LoginPage, HomePage, UserOpsPage, DataOps, LatestFilesPage, DashboardPage],
  imports: [CommonModule, CompModule, RouterModule.forChild(routes), FormsModule, BaseChartDirective, AgGridModule],
  exports: [RouterModule, LoginPage, HomePage, UserOpsPage, DataOps, LatestFilesPage, DashboardPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {}
