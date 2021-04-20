import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, NavigationExtras } from '@angular/router';

interface SignUpModel {
  name: string;
  ic: string;
  phone: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public signupForm = {} as SignUpModel;
  public userID: string;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public afs: AngularFirestore, public router: Router) { }

  ngOnInit() {
  }

  login() {
    console.log("login");
    this.navCtrl.navigateForward('login');
  }

  addUserToDatabase() {
    const userAuthID = this.afs.createId();
    const values = {
      Customer_ID: userAuthID,
      Customer_Name: this.signupForm.name,
      Customer_IC: this.signupForm.ic,
      Customer_Contact: this.signupForm.phone
    }
    console.log(values);
    this.afs.collection('Customer').doc(userAuthID).set(values).then(
      () => {
        alert("Successful")
        let navigationExtras: NavigationExtras = { //pass data to signup2
          state: {
            UserID: userAuthID,
          }
        };
        this.navCtrl.navigateForward('signup2', navigationExtras)
      },
      (error) => {
        alert("An error occurred")
      }
    ).catch(
      (error) => alert("Please try again")
    )
  };

}
