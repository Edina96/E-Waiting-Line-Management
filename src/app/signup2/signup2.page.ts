import { NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page {
  username: string="";
  password: string="";

  constructor(public auth: AngularFireAuth,public navCtrl: NavController) {
  }
  ngOnInit() {
  }

  async register(){
    const {username, password} = this
    try{
      const res = await this.auth.createUserWithEmailAndPassword(username,password)
      console.log(res)
      this.navCtrl.navigateForward('login');
    }
    catch(error){
      console.dir(error)
    }

}
}
