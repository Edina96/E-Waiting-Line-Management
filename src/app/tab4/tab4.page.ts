import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(public navCtrl: NavController, public popoverController: PopoverController) { }

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
