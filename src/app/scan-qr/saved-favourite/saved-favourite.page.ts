import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { GlobalVariable } from '../../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-saved-favourite',
  templateUrl: './saved-favourite.page.html',
  styleUrls: ['./saved-favourite.page.scss'],
})
export class SavedFavouritePage implements OnInit {

  globalVar: GlobalVariable;
  public savedDependentInfo: boolean;
  public dependentName: string;
  dependentArray = [];
  public dependentID: string;
  checked = [];
  values = [];
  public size: number;
  public checkedSize: number;
  public shopID: string = '';

  constructor(public navCtrl: NavController, public alertController: AlertController, public popoverController: PopoverController, public afs: AngularFirestore, globalVar: GlobalVariable) { this.globalVar = globalVar; }

  ngOnInit() {
    this.size = 0;
    this.checkedSize = 0;
    this.getSavedDependentFromDB();
  }

  async infoSubmitted() {
    // this.getDependentIDs();
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
    this.navCtrl.navigateForward('add-dependent');
  }

  onTempChange(event) { //Save temperature Inputs into array
    this.values.push(event.target.value);
  }

  onMyBooleanChange(event, checkbox: string) {
    if (event.target.checked) {
      this.checked.push(checkbox);
    } else {
      let index = this.removeCheckedFromArray(checkbox);
      this.checked.splice(index, 1);
    }
    console.log(this.checked);
  }

  removeCheckedFromArray(checkbox: string) {
    return this.checked.findIndex((category) => {
      return category === checkbox;
    })
  }

  getSavedDependentFromDB() { //Get saved dependent name, display in list
    this.afs.collection('Dependent', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      this.dependentArray = [];
      resp.forEach(element => {
        this.savedDependentInfo = element.get('SavedFavourite');
        if (this.savedDependentInfo === true) {
          this.dependentArray.push(element.get('Dependent_Name'));
        }
      }) 
      return this.dependentArray;
    });
  }

  getShopID(i: number) {
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.globalVar.ticketShopName)).get().subscribe(resp => {
      resp.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.addTemperatureToDB(i, this.shopID);
      })
    });
  }

  addTemperatureToDB(i: number, shopID: string) {
    const dependentRecordID = this.afs.createId();
    const values = {
      Customer_ID: this.globalVar.authUserID,
      Date: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString(),
      Dependent_ID: this.dependentID,
      Dependent_Record_ID: dependentRecordID,
      Dependent_Temperature: this.values[i],
      Shop_ID: shopID
    } 
    this.afs.collection('DependentRecord').doc(dependentRecordID).set(values).then(
      () => {
        console.log("Successfully added to Database.")
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    )
  }

  getDependentIDs() {
    this.size = this.values.length;
    this.checkedSize = this.checked.length;
    if (this.size == this.checkedSize ) {
      for (let i = 0; i < this.size; i++) {
        this.afs.collection('Dependent', ref => ref.where('Dependent_Name', '==', this.checked[i])).get().subscribe(resp => {
          resp.forEach(element => {
            this.dependentID = element.get('Dependent_ID');
            // this.addTemperatureToDB(i);
            this.getShopID(i);
          }) 
          console.log("Temp: " + this.values);
          this.infoSubmitted();
        });
      }
    } else {
      this.presentAlertPrompt();
    }
  }

  async presentAlertPrompt() { //Alert box for submission error
    const alert = await this.alertController.create({
      header: 'Submission Error',
      subHeader: 'Please make sure all temperature of checked dependents are written.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
