import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { GlobalVariable } from '../../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

interface DependentModel {
  name: string;
  ic: string;
  age: string;
  gender: string;
  address: string;
  temp: string;
}

@Component({
  selector: 'app-add-dependent',
  templateUrl: './add-dependent.page.html',
  styleUrls: ['./add-dependent.page.scss'],
})
export class AddDependentPage implements OnInit {

  public dependentForm = {} as DependentModel;
  globalVar: GlobalVariable;
  public authDependentID: string;

  // public favActive = false;

  constructor(public navCtrl: NavController, public alertController: AlertController, public popoverController: PopoverController, globalVar: GlobalVariable, public afs: AngularFirestore, public toastController: ToastController) { this.globalVar = globalVar; }

  ngOnInit() {
  }

  // addToFavourite() {
  //   if (this.favActive == false) {
  //     this.favActive = true;
  //   } else {
  //     this.favActive = false;
  //   }
  // }

  async infoSubmitted() {
    this.addToDatabase(this.globalVar.authUserID);
    const alert = await this.alertController.create({
      header: 'Dependent Added Successfully',
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
    console.log(this.dependentForm);
    this.navCtrl.navigateForward('add-dependent');
  }

  savedFavourite() {
    this.navCtrl.navigateForward('saved-favourite');
  }

  addToDatabase(id: string) { //add dependent info to database in dependent document
    const dependentAuthID = this.afs.createId();
    const values = {
      Dependent_ID: dependentAuthID,
      Dependent_Name: this.dependentForm.name,
      Dependent_IC: this.dependentForm.ic,
      Dependent_Age: this.dependentForm.age,
      Dependent_Gender: this.dependentForm.gender,
      Dependent_Address: this.dependentForm.address,
      Customer_ID: id
    }
    console.log(values);
    this.afs.collection('Dependent').doc(dependentAuthID).set(values).then(
      () => {
        console.log("Successfully added to Database.")
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    )
  };

}
