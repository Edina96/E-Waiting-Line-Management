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
  public visitingShopID: string;
  public ticketID: string;

  constructor(public router: Router, public alertController: AlertController, public navCtrl: NavController, public popoverController: PopoverController, public afs: AngularFirestore, public globalVar: GlobalVariable) { this.globalVar = globalVar; }

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

  async showTicket(ticketNumber: number) {
    let navigationExtras: NavigationExtras = { //pass data to tab 2
      state: {
        shopLogo: this.shopImageURL,
        ticket: ticketNumber,
      }
    };
    const alert = await this.alertController.create({
      header: 'Your E-ticket Number',
      message: `
      <ion-img src="./assets/ticket.svg" alt="Ticket" class="card-alert"></ion-img>
      <p class="ticketNum" style:text-align="center">${ticketNumber}</p>`,
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

  getTicketNumberFromDB() { //From Ticket Collection
    this.afs.collection('Ticket', ref => ref.where('Shop_ID', '==', this.globalVar.visitingShop)).get().subscribe(resp => {
      resp.forEach(element => {
        this.ticketNumber = element.get('Total_Tickets');
        this.ticketID = element.get('Ticket_ID');
        this.ticketNumber += 1;
        console.log("Ticket Number DB: " + this.ticketNumber);
        this.updateTicketNumber(this.ticketNumber, this.ticketID);
        this.storeTicketNumber(this.ticketNumber);
        this.showTicket(this.ticketNumber);
      }) 
    });
  }

  updateTicketNumber(ticketNumber: number, ticketID: string) { //Store in Ticket Collection
    const value = {
      Total_Tickets: ticketNumber
    }
    this.afs.collection('Ticket').doc(ticketID).update(value).then(
      () => {
        console.log("Successfully added to Database.")
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    );
  }

  storeTicketNumber(ticketNumber: number) { //Store in Customer Collection
    const customerRecordID = this.afs.createId();
    const value = {
      Customer_ID: this.globalVar.authUserID,
      Customer_Record_ID: customerRecordID,
      Ticket_Number: ticketNumber
    }
    this.afs.collection('CustomerRecord').doc(customerRecordID).set(value).then(
      () => {
        console.log("Successfully added to Database.")
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    )
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
