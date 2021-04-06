import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface SignUpModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit {

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

  continue() {
    this.navCtrl.navigateForward('login');
  }

  back() {
    this.navCtrl.navigateBack('signup');
  }

}
