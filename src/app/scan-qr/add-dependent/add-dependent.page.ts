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
  myBoolean = false;

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
    if (this.dependentForm.name == null || this.dependentForm.ic == null || this.dependentForm.age == null || this.dependentForm.gender == null || this.dependentForm.address == null || this.dependentForm.temp == null) {
      this.presentAlert();
    } else {
      if (!this.dependentForm.ic.match(/^\d{6}-\d{2}-\d{4}$/)) {
        this.presentAlertPrompt();
      } else {
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
    }
  }

  add() { //Add more dependent
    if (this.dependentForm.name == null || this.dependentForm.ic == null || this.dependentForm.age == null || this.dependentForm.gender == null || this.dependentForm.address == null || this.dependentForm.temp == null) {
      this.presentAlert();
    } else {
      if (!this.dependentForm.ic.match(/^\d{6}-\d{2}-\d{4}$/)) {
        this.presentAlertPrompt();
      } else {
        console.log(this.dependentForm);
        this.addToDatabase(this.globalVar.authUserID);
        this.dependentForm.name = ''; //clear inputs
        this.dependentForm.ic = '';
        this.dependentForm.age = '';
        this.dependentForm.gender = '';
        this.dependentForm.address = '';
        this.dependentForm.temp = '';
      }
    }
  }

  onMyBooleanChange() {
    console.log(this.myBoolean);
  }

  savedFavourite() {
    this.navCtrl.navigateForward('saved-favourite');
  }

  async presentAlertPrompt() { //Alert box IC error
    const alert = await this.alertController.create({
      header: 'Sign Up Error',
      subHeader: 'IC should be in xxxxxx-xx-xxxx format. Please try again.',
      buttons: ['OK']
    });
    await alert.present();
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
      Customer_ID: id,
      SavedFavourite: this.myBoolean
    }
    this.afs.collection('Dependent').doc(dependentAuthID).set(values).then(
      () => {
        console.log("Successfully added to Database.")
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    )
    this.addTemperatureToDB(this.globalVar.authUserID, dependentAuthID);
  }

  async presentAlert() { //Alert box IC error
    const alert = await this.alertController.create({
      header: 'Submission Error',
      subHeader: 'Please fill in all fields.',
      buttons: ['OK']
    });
    await alert.present();
  }

  addTemperatureToDB(customerID: String, dependentID: string) {
      const dependentRecordID = this.afs.createId();
      const value = {
        Customer_ID: customerID,
        Dependent_ID: dependentID,
        Dependent_Record_ID: dependentRecordID,
        Dependent_Temperature: this.dependentForm.temp
      }
      this.afs.collection('DependentRecord').doc(dependentRecordID).set(value).then(
        () => {
          console.log("Successfully added to Database.")
        },
        (error) => alert("An error occurred")
      ).catch(
        (error) => alert("Please try again")
      )
  }

}
