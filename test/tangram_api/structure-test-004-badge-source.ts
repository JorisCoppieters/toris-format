// Angular:
import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '../forms/form-helpers';

@Component({
    selector: 'tg-badge',
    template: '<ng-content></ng-content>',
    styleUrls: ['badge.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BadgeComponent {
    @Input() public set compact (value) { this.isCompact = coerceBooleanProperty(value); }
    @Input() public set notification (value) { this.isNotification = coerceBooleanProperty(value); }
    @Input() public set bordered (value) { this.isBordered = coerceBooleanProperty(value); }
    @Input() public set leftAlign (value) { this.isLeftAlign = coerceBooleanProperty(value); }

    @HostBinding('class.o-badge') true;
    @HostBinding('class.o-badge--compact') public isCompact: boolean;
    @HostBinding('class.o-badge--notification') public isNotification: boolean;
    @HostBinding('class.o-badge--bordered') public isBordered: boolean;
    @HostBinding('class.o-badge--align-left') public isLeftAlign: boolean;
}
