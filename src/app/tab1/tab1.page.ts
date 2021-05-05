import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariable } from '../global-variables';
import firebase from 'firebase/app';
import 'firebase/firestore';

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
  public checkDate: string;
  public totalQueue: number = 0;
  public totalPeople: number = 0;

  public currentTotalTicket: number = 0;

  public array: any[] = [];
  public arrayLength = 0;


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

  doRefresh(event) { //Refresh page
    this.getShopID();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

  getShopID() { //Get ID of visiting shop
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.shopID)).get().subscribe(resp => {
      resp.forEach(element => {
        this.visitingShopID = element.get('Shop_ID');
        this.globalVar.visitingShop = this.visitingShopID;
        this.getQueueNumber(this.visitingShopID);
        this.getTotalPeopleInShop(this.visitingShopID);
      })
    });
  }

  getTotalPeopleInShop(visitingShop: string) { //Get number of people in queue from db ///ADD CUSTOMER LOCATION HERE
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Shop_ID', '==', visitingShop)).get().subscribe(resp2 => {
      resp2.forEach(element2 => {
        if ((element2.get('Customer_WalkInDate') == this.checkDate) && (element2.get('Customer_Temperature') != null)) {
          if (element2.data.length != 0) {
            this.totalPeople = element2.data.length;
            this.addTotalNumberInShop(visitingShop, this.totalPeople);
          }
        }
      })
    })
  }

  addTotalNumberInShop(visitingShop: string, totalPeople: number) {
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('DependentRecord', ref => ref.where('Shop_ID', '==', visitingShop)).get().subscribe(resp2 => {
      resp2.forEach(element2 => {
        if ((element2.get('Date') == this.checkDate) && (element2.get('Dependent_Temperature') != null)) {
          if (element2.data.length != 0) {
            totalPeople += element2.data.length;
            this.totalPeople = totalPeople;
          }
        }
      })
    })
    console.log(this.totalPeople);
  }

  getQueueNumber(visitingShop: string) { //Get number of people in queue from db ///ADD CUSTOMER LOCATION HERE
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_WalkInDate', '==', this.checkDate)).get().subscribe(resp2 => {
      this.array.splice(0, this.array.length);
      resp2.forEach(element2 => {
        if (element2.get('Shop_ID') == visitingShop) {
          console.log(element2.data.length);
          this.array.push ({
            element2
          });
        }
      })
    })
    this.arrayLength = this.array.length;
    console.log(this.arrayLength);
  }

  async showTicket(ticketNumber: number) {
    const alert = await this.alertController.create({
      header: 'Your E-ticket Number',
      message: `
      <ion-img src="./assets/ticket.svg" alt="Ticket" class="card-alert"></ion-img>
      <p class="ticketNum" style:text-align="center">${ticketNumber}</p>`,
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

  getTicketNumberFromDB() { //From Ticket Collection
    this.afs.collection('Ticket', ref => ref.where('Shop_ID', '==', this.globalVar.visitingShop)).get().subscribe(resp => {
      resp.forEach(element => {
        this.ticketNumber = element.get('Total_Tickets');
        this.ticketID = element.get('Ticket_ID');
        this.ticketNumber += 1;
        this.currentTotalTicket+=1;
        console.log("current total" + this.currentTotalTicket);
        if(this.currentTotalTicket==2){
          alert("you can only get one ticket per shop");
          this.navCtrl.navigateBack('shopSelection');
          console.log("before:"+ this.currentTotalTicket);
          this.currentTotalTicket==2;
          console.log("after:"+ this.currentTotalTicket);
        }
        else{
        console.log("Ticket Number DB: " + this.ticketNumber);
        this.updateTicketNumber(this.ticketNumber, this.ticketID);
        this.storeTicketNumber(this.ticketNumber);
        this.showTicket(this.ticketNumber);
        }
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

  storeTicketNumber(ticketNumber: number) { //Store in CustomerRecord Collection
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    const customerRecordID = this.afs.createId();
    const value = {
      Customer_ID: this.globalVar.authUserID,
      Customer_Record_ID: customerRecordID,
      Shop_ID: this.globalVar.visitingShop,
      Customer_WalkInDate: this.checkDate,
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
