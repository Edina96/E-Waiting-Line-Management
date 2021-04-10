import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  signup() {
    console.log(this.signupForm);
    this.navCtrl.navigateForward('signup2');
  }

  login() {
    console.log("login");
    this.navCtrl.navigateForward('login');
  }
}
