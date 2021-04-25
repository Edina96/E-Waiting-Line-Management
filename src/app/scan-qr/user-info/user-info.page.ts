import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariable } from '../../global-variables';
import { Observable } from 'rxjs';

interface InfoModel {
  temperature: string;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {

  globalVar: GlobalVariable;
  public userInfo: Observable<any[]>;
  public infoForm = {} as InfoModel;

  constructor(public navCtrl: NavController, public alertController: AlertController, public afs: AngularFirestore, globalVar: GlobalVariable) { 
    this.globalVar = globalVar;
    console.log("Global Variable: ");
    console.log(this.globalVar.authUserID);
    this.getUsernameFromDB();
  }

  ngOnInit() {
  }

  savedDependent() {
    this.navCtrl.navigateForward('saved-favourite');
  }

  addDependent() {
    this.addTemperatureToDB(this.globalVar.authUserID);
    console.log(this.infoForm);
    this.navCtrl.navigateForward('add-dependent');
  }

  savedFavourite() {
    this.navCtrl.navigateForward('saved-favourite');
  }

  async infoSubmitted() {
    this.addTemperatureToDB(this.globalVar.authUserID);
    console.log(this.infoForm);
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

  getUsernameFromDB() {
    this.userInfo = this.afs.collection('Customer', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).valueChanges(); //use valueChanges to get data from all field, need to save to observable
    console.log(this.userInfo);
  }

  addTemperatureToDB(id: String) {
    const customerRecordID = this.afs.createId();
    const values = {
      Customer_ID: id,
      Customer_Record_ID: customerRecordID,
      Customer_Temperature: this.infoForm.temperature,
      Shop_ID: this.globalVar.visitingShop
    }
    this.afs.collection('CustomerRecord').doc(customerRecordID).set(values).then(
      () => {
        console.log("Successfully added to Database.")
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    )
  }

}
