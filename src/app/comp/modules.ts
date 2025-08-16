import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComp } from './auth-comp/auth-comp';


@NgModule({
  declarations: [AuthComp],
  imports: [CommonModule],
  exports: [AuthComp]
})
export class CompModule {}
