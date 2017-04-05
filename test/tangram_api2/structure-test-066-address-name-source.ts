// Angular:
import { Component, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { AbstractAddressHighlightable } from '../abstract-address-highlightable/abstract-address-highlightable.directive';

@Component({
    selector: 'tg-address-name',
    template: '<ng-content></ng-content>',
    styleUrls: ['../address-block.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddressNameComponent extends AbstractAddressHighlightable {
}