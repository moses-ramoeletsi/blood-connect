import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityFeedBackPage } from './facility-feed-back.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityFeedBackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityFeedBackPageRoutingModule {}
