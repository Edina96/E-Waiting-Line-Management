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
    console.log(this.infoForm);
    this.navCtrl.navigateForward('add-dependent');
  }

  submit() {
    console.log(this.infoForm);
    this.navCtrl.navigateForward('login');
  }
  savedFavourite() {
    this.navCtrl.navigateForward('saved-favourite');
  }

  async infoSubmitted() {
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
    this.userInfo = this.afs.collection('Customer', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).valueChanges(); //valueChanges to get data from all field, need to save to observable
    console.log(this.userInfo);
  }

}
