import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariable {
    authUserID: string = '';
    visitingShop: string = '';
    ticketInfoArray = [];
}