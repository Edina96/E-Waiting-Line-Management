import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopSelectionPage } from './shop-selection.page';

const routes: Routes = [
  {
    path: '',
    component: ShopSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopSelectionPageRoutingModule {}
