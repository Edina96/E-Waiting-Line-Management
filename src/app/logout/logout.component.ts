import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  constructor(public navCtrl: NavController, public popoverController: PopoverController,) { }

  ngOnInit() {}

  logout() {
    this.popoverController.dismiss();
    this.navCtrl.navigateForward('login');
  }
}
