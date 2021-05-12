import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariable {
    authUserID: string = '';
    visitingShop: string = '';
    ticketInfoArray: any[] = [];
    ticketShopName: string = '';
    notificationArray: any[] = [];
    latitude: number = 0;
    longitude: number = 0;
    notify: string = '';
}