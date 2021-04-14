import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  public shopID: string;
  public shopImageURL: string;

  constructor(public router: Router, public alertController: AlertController, public navCtrl: NavController, public popoverController: PopoverController,) { }

  ngOnInit() {
    this.shopID = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.shopID);
    this.updateShopImage();
  }

  updateShopImage() {
    switch (this.shopID) {
      case 'H&M':
        this.shopImageURL = '../../assets/h&mlogo.jpg';
        break;
      case 'Sushi King':
        this.shopImageURL = '../../assets/sushikinglogo.png';
        break;
      case 'Watsons':
        this.shopImageURL = '../../assets/watsonslogo.png';
        break;
    }
  }

  async showTicket() {
    console.log("ticket");
    const alert = await this.alertController.create({
      header: 'Your E-ticket Number',
      message: `
      <ion-img src="./assets/ticket.svg" alt="Ticket" class="card-alert"></ion-img>
      <p class="ticketNum">E029</p>`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('/tabs/tab2');
          }
        }
      ]
    });

    await alert.present();
  }

  changeShop() {
    this.navCtrl.navigateBack('shopSelection');
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
