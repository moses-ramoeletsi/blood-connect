import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonateBloodPageRoutingModule } from './donate-blood-routing.module';

import { DonateBloodPage } from './donate-blood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonateBloodPageRoutingModule
  ],
  declarations: [DonateBloodPage]
})
export class DonateBloodPageModule {}
