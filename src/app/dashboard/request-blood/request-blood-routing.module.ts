import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestBloodPage } from './request-blood.page';

const routes: Routes = [
  {
    path: '',
    component: RequestBloodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestBloodPageRoutingModule {}
