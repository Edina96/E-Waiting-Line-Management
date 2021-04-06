import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDependentPage } from './add-dependent.page';

const routes: Routes = [
  {
    path: '',
    component: AddDependentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDependentPageRoutingModule {}
