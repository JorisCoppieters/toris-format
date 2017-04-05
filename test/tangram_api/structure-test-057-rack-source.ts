import { Component, ElementRef, Input, OnChanges, OnInit, Renderer, SimpleChanges, ViewEncapsulation, Directive, HostBinding } from '@angular/core';

import { coerceBooleanProperty } from '../../forms/form-helpers';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DomHelperService } from '../../../core/services/dom-helper.service';
import { EnumHelperService } from '../../../core/services/enum-helper.service';
import RackGapTypeEnum from '../rack-gap-type.enum';

const GAP_CLASS_PREFIX = 'o-rack--set-gap-';

@Component({
    selector: 'tg-rack',
    template: '<ng-content></ng-content>',
    styleUrls: ['../rack.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RackComponent implements OnInit, OnChanges {

    @Input() public set alignTop (value) { this.isAlignTop = coerceBooleanProperty(value); }
    @Input() public set bleed (value) { this.hasBleed = coerceBooleanProperty(value); }
    @Input() public set center (value) { this.isCenter = coerceBooleanProperty(value); }
    @Input() public set flexContents  (value) { this.hasFlexContents = coerceBooleanProperty(value); }
    @Input() public set linkColor (value) { this.hasLinkColor = coerceBooleanProperty(value); }
    @Input() public set noBleedAtSm (value) { this.hasNoBleedAtSm = coerceBooleanProperty(value); }
    @Input() public set ruled (value) { this.isRuled = coerceBooleanProperty(value); }
    @Input() public gap: string;

    @HostBinding('class.o-rack') true;
    @HostBinding('class.o-rack--align-top') public isAlignTop: boolean;
    @HostBinding('class.o-rack--bleed') public hasBleed: boolean;
    @HostBinding('class.o-rack--center') public isCenter: boolean;
    @HostBinding('class.o-rack--has-flex-contents') public hasFlexContents: boolean;
    @HostBinding('class.o-rack--link-color') public hasLinkColor: boolean;
    @HostBinding('class.o-rack--no-bleed-at-sm') public hasNoBleedAtSm: boolean;
    @HostBinding('class.o-rack--ruled') public isRuled: boolean;

    public classes: Array<string>;
    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService,
        private elementRef: ElementRef,
        private enumHelperService: EnumHelperService,
        private renderer: Renderer
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: RackComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
        this.initializeGapClasses();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initializeGapClasses(changes);
    }

    private initializeGapClasses (changes?: SimpleChanges) {
        if (!changes && !this.gap) { return; }
        this.domHelperService.applyClassFromEnum(this.elementRef, this.renderer, GAP_CLASS_PREFIX, this.gap, RackGapTypeEnum);
    }

    private validate (): void {
        if (this.gap) {
            this.enumHelperService.validate<typeof RackGapTypeEnum>(RackGapTypeEnum, this.gap, this.debugHelper);
        }
    }
}

// Define content tags:
@Directive({
    /* tslint:disable: directive-selector-name directive-selector-type */
    selector: 'tg-rack-item-prefix, tg-rack-item-suffix, tg-rack-item-note, tg-rack-item-primary-note'
    /* tslint:enable: directive-selector-name directive-selector-type */
})
export class RackItemContentTags { }
