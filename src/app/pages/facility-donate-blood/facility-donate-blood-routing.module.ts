import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityDonateBloodPage } from './facility-donate-blood.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityDonateBloodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityDonateBloodPageRoutingModule {}
