import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariable } from '../global-variables';
import { ToastController } from '@ionic/angular';
import { Geolocation, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-queue-info',
  templateUrl: './queue-info.page.html',
  styleUrls: ['./queue-info.page.scss'],
})
export class QueueInfoPage implements OnInit {

  public ticketShopID: string;
  public ticketShopImageURL: string;
  public ticketShopName: string = '';
  public ticketNumber: number;
  public ticketID: string;
  public shopInfo: Observable<any[]>;
  public checkDate: string;
  public maxCapacity: string;
  public shopID: string = '';
  public ticketInfoArray: any[] = [];
  public currentArray: number[] = [];
  public totalPeople: number = 0;
  public currentNumber: number = 0;
  public array: any[] = [];
  public arrayLength = 0;
  public latitude = 0;
  public longitude = 0;

  constructor(public router: Router, public alertController: AlertController, public navCtrl: NavController, private qrScanner: QRScanner, public afs: AngularFirestore, public globalVar: GlobalVariable, public toastController: ToastController, private geolocation: Geolocation, private localNotifications: LocalNotifications) {
    this.globalVar = globalVar;
    this.ticketInfoArray = this.globalVar.ticketInfoArray;
  }

  ngOnInit() {
    this.ticketShopID = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.ticketShopID);
    this.updateShopImage();
    this.getShopMaxCapacity();
    this.getCurrentTicketNumber();
  }

  updateShopImage() {
    switch (this.ticketShopID) {
      case 'H&M':
        this.ticketShopImageURL = '../../assets/h&mlogo.jpg';
        this.ticketShopName = 'H&M';
        this.globalVar.ticketShopName = this.ticketShopName;
        break;
      case 'Sushi King':
        this.ticketShopImageURL = '../../assets/sushikinglogo.png';
        this.ticketShopName = 'Sushi King';
        this.globalVar.ticketShopName = this.ticketShopName;
        break;
      case 'Watsons':
        this.ticketShopImageURL = '../../assets/watsonslogo.png';
        this.ticketShopName = 'Watsons';
        this.globalVar.ticketShopName = this.ticketShopName;
        break;
    }
  }

  getCurrentTicketNumber() {
    var current = 0;
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.ticketShopName)).get().subscribe(resp => {
      resp.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.getQueueNumber(this.shopID);
        this.afs.collection('CustomerRecord', ref => ref.where('Shop_ID', '==', this.shopID).where('Customer_WalkInDate', '==', this.checkDate)).get().subscribe(resp => {
          resp.forEach(element => {
            this.currentArray.push(element.get('Ticket_Number'));
            current = Math.min.apply(Math, this.currentArray);
            this.currentNumber = current;
            console.log("Current: " + Math.min.apply(Math, this.currentArray));
            this.getTicketNumber(this.currentNumber);
          })
        });
      })
    });
  }

  getTicketNumber(currentNumber: number) { //Display assigned ticket number in page
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID'))).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            if (this.ticketShopName == resp4.get('Shop_Name') && resp2.get('Customer_WalkInDate') == this.checkDate) {
              this.ticketNumber = resp2.get('Ticket_Number');
              this.sendNotification(this.ticketNumber, currentNumber);
            }
          });
        });
      });
    });
  }

  getShopMaxCapacity() { //Display max capacity in page
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID'))).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            if (this.ticketShopName == resp4.get('Shop_Name')) {
              this.maxCapacity = resp4.get('Max_Capacity');
            }
            this.getTotalPeopleInShop();
          });
        });
      });
    });
  }

  getTotalPeopleInShop() { //Get number of people in shop from db
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.ticketShopName)).get().subscribe(resp2 => {
      resp2.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.afs.collection('CustomerRecord', ref => ref.where('Shop_ID', '==', this.shopID)).get().subscribe(resp => {
          resp.forEach(element2 => {
            if ((element2.get('Customer_WalkInDate') == this.checkDate) && (element2.get('Customer_Temperature') != null)) {
              if (element2.data.length != 0) {
                this.totalPeople = element.data.length;
                this.addTotalNumberInShop(this.shopID, this.totalPeople);
              }
            }
          });
          this.getQueueNumber(this.shopID);
        })
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

  getQueueNumber(visitingShop: string) { //Get number of people in queue from db
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_WalkInDate', '==', this.checkDate)).get().subscribe(resp2 => {
      resp2.forEach(element2 => {
        if ((element2.get('Shop_ID') == visitingShop) && (element2.get('Customer_Temperature') == null)) {
          console.log(element2.data.length);
          this.array.push({
            element2
          });
        }
      })
    })
    this.arrayLength = this.array.length;
    console.log(this.arrayLength);
  }

  async throwTicket() {
    console.log("ticket");
    const alert = await this.alertController.create({
      header: 'Ticket Cancelation',
      message: `Are you sure to cancel your e-ticket?`,
      buttons: [
        { text: 'NO', handler: () => { console.log("Cancel") } },
        {
          text: 'YES',
          handler: () => {
            this.getShopID();
            console.log("Ticket Canceled");
            this.navCtrl.navigateForward('/tabs/tab2');
          }
        }
      ]
    });
    await alert.present();
  }

  getShopID() {
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.ticketShopName)).get().subscribe(resp => {
      resp.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.getTicketNumberFromDB(this.shopID);
      })
    });
  }

  getTicketNumberFromDB(ticketShopID: string) { //From Ticket Collection
    this.afs.collection('Ticket', ref => ref.where('Shop_ID', '==', ticketShopID)).get().subscribe(resp => {
      resp.forEach(element => {
        this.ticketNumber = element.get('Total_Tickets');
        this.ticketID = element.get('Ticket_ID');
        this.ticketNumber -= 1;
        this.updateTicketNumber(this.ticketNumber, this.ticketID);
        this.getCustomerRecordID(ticketShopID);
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

  getCustomerRecordID(ticketShopID: string) {
    var customerRecordID = "";
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID).where('Shop_ID', '==', ticketShopID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', ticketShopID)).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            console.log("Ticket Shop Name: " + this.ticketShopName);
            if (this.ticketShopName == resp4.get('Shop_Name') && resp2.get('Customer_WalkInDate') == this.checkDate) {
              customerRecordID = resp2.get('Customer_Record_ID');
              this.afs.collection('CustomerRecord').doc(customerRecordID).delete();
              console.log(resp4.get('Shop_Name'));
              this.ticketInfoArray.splice(this.ticketInfoArray.indexOf(resp4.get('Shop_Name')), 1);
            }
          });
        });
      });
      return this.ticketInfoArray;
    });
  }

  scanCode() {
    const ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];
    //Optionally request the permission early
    this.qrScanner.prepare()
      .then(async (status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          var camtoast = await this.toastController.create({
            message: 'camera permission granted',
            duration: 1000
          });
          camtoast.present();

          this.qrScanner.show();
          // this.qrScanner.resumePreview();
          window.document.querySelector('ion-app').classList.add('transparentBody');
          ionApp.style.display = 'none';

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
            alert('Scanned something' + text);
            this.qrScanner.hide(); // hide camera preview
            window.document.querySelector('ion-app').classList.remove('transparentBody');
            const toast = await this.toastController.create({
              message: 'You scanned text is this :' + text,
              duration: 6000
            });
            toast.present();
            scanSub.unsubscribe(); // stop scanning
            ionApp.style.display = 'block';
          });
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.qrScanner.openSettings();
          alert('request permission');
        }
      })
      .catch((e: any) => alert('Error is' + e));

    this.getLocation();
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      alert('Latitude: ' + resp.coords.latitude + ' Longitude: ' + resp.coords.longitude);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const value = {
        Geolocation: [this.latitude, this.longitude]
      }
      this.afs.collection('Customer').doc(this.globalVar.authUserID).update(value).then(
        () => {
          console.log("Successfully added to Database.")
        },
        (error) => alert("An error occurred")
      ).catch(
        (error) => alert("Please try again")
      );
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition(); //To keep track of changes in devices' location
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      if ((data as Geoposition).coords != undefined) {
        var geoposition = (data as Geoposition);
        console.log('Latitude: ' + geoposition.coords.latitude + ' Longitude: ' + geoposition.coords.longitude)
        const value = {
          Geolocation: [geoposition.coords.latitude, geoposition.coords.longitude]
        } ///UNCOMMENT!!!
        this.afs.collection('Customer').doc(this.globalVar.authUserID).update(value).then(
          () => {
            console.log("Successfully added to Database.")
          },
          (error) => alert("An error occurred")
        ).catch(
          (error) => alert("Please try again")
        );
      } else {
        var positionError = (data as PositionError);
        console.log('Error ' + positionError.code + ': ' + positionError.message);
      }
    });
    this.navCtrl.navigateForward("user-info");
  }

  sendNotification(ticketNumber: number, currentNumber: number) {
    if ((ticketNumber - 1) == currentNumber) {
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 1,
        title: 'Your Turn is reaching',
        text: 'Please proceed to the counter',
        data: { secret: 'key' },
        vibrate: true,
        foreground: true
      });
    }
    if (ticketNumber == currentNumber) {
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 1,
        title: 'Its your turn',
        text: 'Please proceed to the counter',
        data: { secret: 'key' },
        vibrate: true,
        foreground: true
      });
    }
  }

}