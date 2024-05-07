import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityDashboardPageRoutingModule } from './facility-dashboard-routing.module';

import { FacilityDashboardPage } from './facility-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityDashboardPageRoutingModule
  ],
  declarations: [FacilityDashboardPage]
})
export class FacilityDashboardPageModule {}
