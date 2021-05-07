import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariable } from '../../global-variables';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/firestore';

interface InfoModel {
  temperature: string;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {

  public userInfo: Observable<any[]>;
  public infoForm = {} as InfoModel;
  public recordID: string;
  public shopID: string = '';

  constructor(public navCtrl: NavController, public alertController: AlertController, public afs: AngularFirestore, public globalVar: GlobalVariable) {
    this.globalVar = globalVar;
    console.log("Global Variable: ");
    console.log(this.globalVar.authUserID);
    this.getUsernameFromDB();
  }

  ngOnInit() {
  }

  savedFavourite() {
    if (this.infoForm.temperature == null) {
      this.presentAlertPrompt();
    } else {
      // this.addTemperatureToDB(this.globalVar.authUserID);
      this.getShopID();
      this.navCtrl.navigateForward('saved-favourite');
    }
  }

  addDependent() {
    if (this.infoForm.temperature == null) {
      this.presentAlertPrompt();
    } else {
      // this.addTemperatureToDB(this.globalVar.authUserID);
      this.getShopID();
      this.navCtrl.navigateForward('add-dependent');
    }
  }

  // async infoSubmitted() {
  //   if (this.infoForm.temperature == null) {
  //     this.presentAlertPrompt();
  //   } else {
  //     // this.addTemperatureToDB(this.globalVar.authUserID);
  //     this.getShopID();
  //     const alert = await this.alertController.create({
  //       header: 'Success',
  //       subHeader: 'You have successfully check-in.',
  //       message: `Please take note that the app has recorded your geolocation details for the purpose of automating check-out.`,
  //       buttons: [
  //         {
  //           text: 'OK',
  //           handler: () => {
  //             this.navCtrl.navigateForward('queue-info');
  //           }
  //         }
  //       ]
  //     });
  //     await alert.present();
  //   }
  // }

  async infoSubmitted() {
    if (this.infoForm.temperature == null) {
      this.presentAlertPrompt();
    } else if (this.infoForm.temperature === "37.8" || this.infoForm.temperature > "37.8") {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: 'Your Body Temperature is too HIGH. Please contact shop assistants for further assistance.',
        buttons: ['OK']
      });
      await alert.present();
      this.navCtrl.navigateBack('/tabs/tab1');
    }
    //this.presentAlertPrompt();
    else {
      // this.addTemperatureToDB(this.globalVar.authUserID);
      this.getShopID();
      const alert = await this.alertController.create({
        header: 'Success',
        subHeader: 'You have successfully check-in.',
        message: `Please take note that the app has recorded your geolocation details for the purpose of automating check-out.`,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.navigateForward('queue-info');
            }
          }
        ]
      });
      await alert.present();
    }
  }

  getUsernameFromDB() {
    this.userInfo = this.afs.collection('Customer', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).valueChanges(); //use valueChanges to get data from all field, need to save to observable
    console.log(this.userInfo);
  }

  getShopID() {
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.globalVar.ticketShopName)).get().subscribe(resp => {
      resp.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.addTemperatureToDB(this.globalVar.authUserID, this.shopID);
      })
    });
  }

  addTemperatureToDB(id: String, shopID: string) {
    const values = {
      Customer_Temperature: this.infoForm.temperature,
      Customer_WalkInDate: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString(),
      Customer_WalkInTime: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toLocaleTimeString(),
    }
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID).where('Shop_ID', '==', shopID)).get().subscribe(resp => {
      resp.forEach(element => {
        if (element.get('Customer_WalkInDate') != null) {
          this.recordID = element.get('Customer_Record_ID');
          this.afs.collection('CustomerRecord').doc(this.recordID).update(values).then(
            () => {
              console.log("Successfully added to Database.")
            },
            (error) => alert("An error occurred")
          ).catch(
            (error) => alert("Please try again")
          );
        }
      })
    });
  }

  checkTemperature() {
    if (this.infoForm.temperature == null) {
      this.presentAlertPrompt();
    }
  }

  async presentAlertPrompt() { //Alert box for missing temperature
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Please enter your temperature.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
