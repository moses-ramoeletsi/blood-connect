import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterFacilityPage } from './register-facility.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterFacilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterFacilityPageRoutingModule {}
