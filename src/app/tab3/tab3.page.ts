import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';
import { GlobalVariable } from '../global-variables';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public notificationArray: any[] = [];

  constructor(public popoverController: PopoverController, public globalVar: GlobalVariable) { 
    this.globalVar = globalVar;
    this.notificationArray = this.globalVar.notificationArray; }

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
