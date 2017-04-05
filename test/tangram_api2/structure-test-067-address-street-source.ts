// Angular:
import { Component, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { AbstractAddressHighlightable } from '../abstract-address-highlightable/abstract-address-highlightable.directive';

@Component({
    selector: 'tg-address-street',
    template: '<ng-content></ng-content>',
    styleUrls: ['../address-block.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddressStreetComponent extends AbstractAddressHighlightable {
}