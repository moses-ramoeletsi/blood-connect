import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipientRequestPage } from './recipient-request.page';

const routes: Routes = [
  {
    path: '',
    component: RecipientRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipientRequestPageRoutingModule {}
