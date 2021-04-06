import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueueInfoPageRoutingModule } from './queue-info-routing.module';

import { QueueInfoPage } from './queue-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QueueInfoPageRoutingModule
  ],
  declarations: [QueueInfoPage]
})
export class QueueInfoPageModule {}
