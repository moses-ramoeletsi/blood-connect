import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityRequestsPage } from './facility-requests.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityRequestsPageRoutingModule {}
