// Angular:
import { Component, Directive, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'tg-address',
    templateUrl: './address.component.html',
    styleUrls: ['../address-block.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddressComponent {}

// Define content tags:
@Directive({
    /* tslint:disable: directive-selector-name directive-selector-type */
    selector: 'tg-address-suburb, tg-address-city, tg-address-postcode, tg-address-country'
    /* tslint:enable: directive-selector-name directive-selector-type */
})
export class AddressComponentContentTags { }