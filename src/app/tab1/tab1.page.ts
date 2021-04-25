import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariable } from '../global-variables';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  public shopID: string;
  public shopImageURL: string;
  public ticketNumber: number;
  globalVar: GlobalVariable;
  public visitingShopID: string;

  constructor(public router: Router, public alertController: AlertController, public navCtrl: NavController, public popoverController: PopoverController, public afs: AngularFirestore, globalVar: GlobalVariable) { this.globalVar = globalVar; }

  ngOnInit() {
    this.shopID = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.shopID);
    this.updateShopImage();
    this.ticketNumber = 100;
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
    this.getShopID();
  }

  getShopID() { //Get ID of visiting shop
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.shopID)).get().subscribe(resp => {
      resp.forEach(element => {
        this.visitingShopID = element.get('Shop_ID');
        this.globalVar.visitingShop = this.visitingShopID;
      }) 
    });
  }

  async showTicket() {
    this.generateTicket();
    console.log(this.ticketNumber);
    let navigationExtras: NavigationExtras = { //pass data to tab 2
      state: {
        shopLogo: this.shopImageURL,
        ticket: this.ticketNumber,
      }
    };
    const alert = await this.alertController.create({
      header: 'Your E-ticket Number',
      message: `
      <ion-img src="./assets/ticket.svg" alt="Ticket" class="card-alert"></ion-img>
      <p class="ticketNum">${this.ticketNumber}</p>`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('/tabs/tab2', navigationExtras);
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

  generateTicket() {
    this.ticketNumber = this.ticketNumber + 1;
    return (this.ticketNumber);
  }

}
