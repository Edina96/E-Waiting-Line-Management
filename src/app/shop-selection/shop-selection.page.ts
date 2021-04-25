import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-shop-selection',
  templateUrl: './shop-selection.page.html',
  styleUrls: ['./shop-selection.page.scss'],
})
export class ShopSelectionPage implements OnInit {

  constructor(public router: Router, public popoverController: PopoverController) { }

  ngOnInit() {
  }

  async logout(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

}
