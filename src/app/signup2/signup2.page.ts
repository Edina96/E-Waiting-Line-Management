import { NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page {
  username: string = "";
  password: string = "";
  customerID: any;

  constructor(public auth: AngularFireAuth, public navCtrl: NavController, public alertController: AlertController, public afs: AngularFirestore, public router: Router, public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) { //receive data from signup
        this.customerID = this.router.getCurrentNavigation().extras.state.UserID;
        console.log("UserID: ");
        console.log(this.customerID);
      }
    });
  }

  ngOnInit() {
  }

  async register() {
    const { username, password } = this
    try {
      const res = await this.auth.createUserWithEmailAndPassword(username, password)
      console.log(res)
      this.addToDatabase(this.customerID);
    }
    catch (error) {
      console.dir(error)
      //Display Error when user don't register according to format
      const alert = await this.alertController.create({
        header: 'Wrong input',
        subHeader: 'Email/Password format error',
        message: 'Please make sure you have enter the email and password format correctly',
        buttons: ['OK']
      });
      await alert.present();
      this.navCtrl.navigateForward('signup2');
    }
  }

  back() {
    this.navCtrl.navigateBack('signup');
  }

  login() {
    console.log("login");
    this.navCtrl.navigateForward('login');
  }

  addToDatabase(id: string) {
    const userAuthID = this.afs.createId();
    const values = {
      Customer_ID: userAuthID,
      Email: this.username
    }
    console.log(values);
    this.afs.collection('Customer').doc(id).update(values).then(
      () => {
        alert("Database Updated")
        this.navCtrl.navigateForward('login')
      },
      (error) => {
        alert("An error occurred")
      }
    ).catch(
      (error) => 
        alert("Please try again")
    )
  };
}
