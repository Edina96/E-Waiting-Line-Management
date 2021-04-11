import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-selection',
  templateUrl: './shop-selection.page.html',
  styleUrls: ['./shop-selection.page.scss'],
})
export class ShopSelectionPage implements OnInit {

  constructor(public router: Router) {}

  ngOnInit() {
  }

  getShopName(shopName: string) {
    console.log(shopName);
    this.router.navigateByUrl('/tabs/tab1/' + shopName);
  }
}
