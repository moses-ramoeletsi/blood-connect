import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityPostEventsPage } from './facility-post-events.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityPostEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityPostEventsPageRoutingModule {}
