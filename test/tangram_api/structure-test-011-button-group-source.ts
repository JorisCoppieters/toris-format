import { Input, ElementRef, Component, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { TangramInvalidContentError } from '../../../core/errors/tangram-invalid-content-error';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-button-group',
    template: '<ng-content></ng-content>',
    styleUrls: ['button-group.component.css'],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.o-button-group]': 'true',
        '[class.o-button-group--fit-across]': 'fitAcross',
        '[class.o-button-group--stack-at-sm]': 'stackAtSmall',
        '[class.o-button-group--stack-tiles]': 'stackTiles'
    }
})
export class ButtonGroupComponent implements AfterContentInit {
    @Input() public set fitAcross (value) { this._fitAcross = coerceBooleanProperty(value); }
    public _fitAcross: boolean;

    @Input() public set stackAtSmall (value) { this._stackAtSmall = coerceBooleanProperty(value); }
    public _stackAtSmall: boolean;

    @Input() public set stackTiles (value) { this._stackTiles = coerceBooleanProperty(value); }
    public _stackTiles: boolean;

    private debugHelper: DebugHelperModel;

    constructor (
        private elementRef: ElementRef,
        debugHelperService: DebugHelperService
    ) {
        if (debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ButtonGroupComponent,
                element: elementRef
            };
        }
    }

    public ngAfterContentInit () {
        if (Array.prototype.some.call(this.elementRef.nativeElement.children, (el: HTMLElement) => {
                return !el.attributes['tgButton'] && !el.attributes['tgTileButton'];
            })) {
            throw new TangramInvalidContentError(`<tg-button-group> may only contain buttons or links with [tgButton] or [tgTileButton] attributes.`, this.debugHelper);
        }
    }
}
