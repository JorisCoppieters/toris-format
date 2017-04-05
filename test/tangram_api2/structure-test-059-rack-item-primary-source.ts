import { Component, HostBinding } from '@angular/core';
import { RackItemComponent } from '../rack-item/rack-item.component';

@Component({
    selector: 'tg-rack-item-primary',
    templateUrl: './rack-item-primary.component.html'
})
export class RackItemPrimaryComponent {

    @HostBinding('class.o-rack-item__primary') public primary = true;
    @HostBinding('class.o-rack-item__primary--has-flex-contents') public get hasFlex () {
        return this.rackItemComponent.flexContentsPrimary;
    }

    constructor (
        private rackItemComponent: RackItemComponent
    ) {}
}