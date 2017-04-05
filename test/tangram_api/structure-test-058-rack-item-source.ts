import { Component, ContentChild, ElementRef, Input, OnInit, OnChanges, Renderer, SimpleChanges, HostBinding } from '@angular/core';
import { RackComponent } from '../rack/rack.component';
import { RackItemSecondaryDirective } from '../rack-item-secondary/rack-item-secondary.directive';

// Enum:
import RackGapTypeEnum from '../rack-gap-type.enum';

// Services:
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DomHelperService } from '../../../core/services/dom-helper.service';

// Errors:
import { coerceBooleanProperty } from '../../forms/form-helpers';
import { TangramInvalidOptionError } from '../../../core/errors/tangram-invalid-option-error';

// Constants:
const GAP_CLASS_PREFIX = 'o-rack-item--set-gap-';

@Component({
    selector: 'tg-rack-item, [tgRackItem]',
    templateUrl: 'rack-item.component.html'
})
export class RackItemComponent implements OnInit, OnChanges {
    public classes: Array<string>;
    public isLink: boolean;

    @Input() public set flexContentsPrimary (value: boolean) { this._flexContentsPrimary = coerceBooleanProperty(value); }
    public get flexContentsPrimary (): boolean { return this._flexContentsPrimary; }
    private _flexContentsPrimary: boolean;

    @Input() public set flexContentsSecondary (value: boolean) { this._flexContentsSecondary = coerceBooleanProperty(value); }
    public get flexContentsSecondary (): boolean { return coerceBooleanProperty(this._flexContentsSecondary); }
    private _flexContentsSecondary: boolean;

    @Input() public set alignTop (value) { this._alignTop = coerceBooleanProperty(value) || this.fromRack('tgAlignTop'); }
    @Input() public set bleed (value) { this._bleed = coerceBooleanProperty(value) || this.fromRack('tgBleed'); }
    @Input() public set center (value) { this._center = coerceBooleanProperty(value) || this.fromRack('tgCenter'); }
    @Input() public set linkColor (value) { this._linkColor = coerceBooleanProperty(value); }
    @Input() public set noBleedAtSm (value) { this._noBleedAtSm = coerceBooleanProperty(value); }
    @Input() public set ruled (value) { this._ruled = coerceBooleanProperty(value) || this.fromRack('tgRuled'); }
    @Input() public gap: string;

    @HostBinding('class.o-rack-item') true;
    @HostBinding('class.o-rack-item--align-top') public _alignTop: boolean;
    @HostBinding('class.o-rack-item--bleed') public _bleed: boolean;
    @HostBinding('class.o-rack-item--center') public _center: boolean;
    @HostBinding('class.o-rack-item--link-color') public _linkColor: boolean;
    @HostBinding('class.o-rack-item--no-bleed-at-sm') public _noBleedAtSm: boolean;
    @HostBinding('class.o-rack-item--ruled') public _ruled: boolean;

    @ContentChild(RackItemSecondaryDirective) public rackItemSecondary;

    private _debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService,
        private elementRef: ElementRef,
        private rackComponent: RackComponent,
        private renderer: Renderer
    ) {
        if (this.debugHelperService.isEnabled) {
            this._debugHelper = {
                component: RackItemComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
        this.initializeGapClasses();

        if (!this.elementRef.nativeElement) {
            return;
        }
        this.isLink = this.elementRef.nativeElement.tagName.toLowerCase() === 'a';
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initializeGapClasses(changes);
    }

    protected validate () {
        if (this.center && this.rackItemSecondary) {
            throw new TangramInvalidOptionError(`<tg-rack-item-secondary> can't be used with centered rack`, this._debugHelper);
        }
    }

    private initializeGapClasses (changes?: SimpleChanges) {
        let gap = this.gap || this.fromRack('tgGap');
        if (!changes && !gap) {
            return;
        }
        this.domHelperService.applyClassFromEnum(this.elementRef, this.renderer, GAP_CLASS_PREFIX, gap, RackGapTypeEnum);
    }

    private fromRack (prop: string) {
        return this.rackComponent && this.rackComponent[prop];
    }
}
