import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QueueInfoPage } from './queue-info.page';

const routes: Routes = [
  {
    path: '',
    component: QueueInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueueInfoPageRoutingModule {}
