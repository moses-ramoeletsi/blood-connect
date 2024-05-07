import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityDashboardPage } from './facility-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityDashboardPageRoutingModule {}
