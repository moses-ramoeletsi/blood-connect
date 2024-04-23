import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipientRequestPageRoutingModule } from './recipient-request-routing.module';

import { RecipientRequestPage } from './recipient-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipientRequestPageRoutingModule
  ],
  declarations: [RecipientRequestPage]
})
export class RecipientRequestPageModule {}
