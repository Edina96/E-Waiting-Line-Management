import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { GlobalVariable } from '../../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface InfoModel {
  temp1: string;
  temp2: string;
}

@Component({
  selector: 'app-saved-favourite',
  templateUrl: './saved-favourite.page.html',
  styleUrls: ['./saved-favourite.page.scss'],
})
export class SavedFavouritePage implements OnInit {

  public infoForm = {} as InfoModel;
  globalVar: GlobalVariable;
  // public savedDependentInfo: Observable<any[]>;
  public savedDependentInfo: boolean;
  public dependentName: string;

  constructor(public navCtrl: NavController, public alertController: AlertController, public popoverController: PopoverController, public afs: AngularFirestore, globalVar: GlobalVariable) { this.globalVar = globalVar; }

  ngOnInit() {
    this.getSavedDependentFromDB();
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

  add() {
    // console.log(this.dependentForm);
    this.navCtrl.navigateForward('add-dependent');
  }

  getSavedDependentFromDB() {
    this.afs.collection('Dependent', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(element => {
        this.savedDependentInfo = element.get('SavedFavourite');
        if (this.savedDependentInfo === true) {
          this.dependentName = element.get('Dependent_Name')
          console.log("Saved Favourite: " + this.dependentName)
        }
      }) 
    }); //use subscribe, foreach if no document id
  }
}
