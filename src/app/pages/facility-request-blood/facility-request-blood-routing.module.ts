import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityRequestBloodPage } from './facility-request-blood.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityRequestBloodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityRequestBloodPageRoutingModule {}
