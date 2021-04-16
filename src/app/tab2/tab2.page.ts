import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  data: any;
  shopImgURL: any;

  constructor(public navCtrl: NavController, public popoverController: PopoverController, public router: Router, public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) { //receive data from tab 1
        this.data = this.router.getCurrentNavigation().extras.state.ticket;
        this.shopImgURL = this.router.getCurrentNavigation().extras.state.shopLogo;
      }
    });
  }

  add() {
    this.navCtrl.navigateForward('shopSelection');
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
