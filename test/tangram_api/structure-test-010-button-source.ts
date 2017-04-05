import { Input, OnInit, ElementRef, ContentChild, Directive, Renderer, HostBinding, Optional, ContentChildren, QueryList, AfterContentInit, SimpleChanges, Component, ViewEncapsulation, OnChanges } from '@angular/core';

import { TangramInvalidOptionError } from '../../../core/errors/tangram-invalid-option-error';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { BadgeComponent } from '../../badge/badge.component';
import { IconComponent } from '../../icons/icon/icon.component';
import { Observable } from 'rxjs/Observable';
import { AbstractButtonClass } from '../abstract-button.class';
import { coerceBooleanProperty } from '../../forms/form-helpers';
import { StickerComponent } from '../../helpers/positioning/sticker.component';

@Component({
    selector: 'a[tgButton], button[tgButton]',
    template: '<ng-content></ng-content>',
    styleUrls: ['./button.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ButtonComponent extends AbstractButtonClass implements OnInit, AfterContentInit, OnChanges {
    @Input() public loading: Promise<any> | Observable<any>;
    @Input() public size: string;
    @Input() public set fullWidth (value) {
        this._fullWidth = coerceBooleanProperty(value);
    }
    @Input() public set compact (value) {
        this._compact = coerceBooleanProperty(value);
    }
    @Input() public set rounded (value) {
        this._rounded = coerceBooleanProperty(value);
    }
    @Input() public set overlay (value) {
        this._overlay = coerceBooleanProperty(value);
    }
    @Input() public set primary (value) {
        this._primary = coerceBooleanProperty(value);
    }
    @Input() public set secondary (value) {
        this._secondary = coerceBooleanProperty(value);
    }
    @Input() public set inverted (value) {
        this._inverted = coerceBooleanProperty(value);
    }
    @Input() public set danger (value) {
        this._danger = coerceBooleanProperty(value);
    }
    @Input() public set success (value) {
        this._success = coerceBooleanProperty(value);
    }
    @Input() public set dangerInverted (value) {
        this._dangerInverted = coerceBooleanProperty(value);
    }
    @Input() public set successInverted (value) {
        this._successInverted = coerceBooleanProperty(value);
    }
    @Input() public set transparent (value) {
        this._transparent = coerceBooleanProperty(value);
    }
    @Input() public set dark (value) {
        this._dark = coerceBooleanProperty(value);
    }
    @Input() public set link (value) {
        this._link = coerceBooleanProperty(value);
    }
    @Input() public set marketplace (value) {
        this._marketplace = coerceBooleanProperty(value);
    }

    @HostBinding('class.o-button--full-width') public _fullWidth: boolean;
    @HostBinding('class.o-input--inline-compact') public _compact: boolean;
    @HostBinding('class.o-button--pill') public _rounded: boolean;
    @HostBinding('class.o-button--overlay') public _overlay: boolean;
    @HostBinding('class.o-transparent-button') public _transparent: boolean;
    @HostBinding('class.o-button--small') public _size: boolean;
    @HostBinding('class.o-button--has-badge') public hasBadge: boolean;
    @HostBinding('class.o-button--loading') public _loading: boolean;
    @HostBinding('class.o-button--icon-only') public iconOnly: boolean;
    @HostBinding('class.o-button--icon-on-left') public iconOnLeft: boolean;
    @HostBinding('class.o-button--icon-on-right') public iconOnRight: boolean;
    @HostBinding('class.o-button--icon-on-left-and-right') public iconOnLeftAndRight: boolean;
    @HostBinding('class.o-button--primary') public _primary: boolean;
    @HostBinding('class.o-button--secondary') public _secondary: boolean;
    @HostBinding('class.o-button--inverted') public _inverted: boolean;
    @HostBinding('class.o-button--danger') public _danger: boolean;
    @HostBinding('class.o-button--success') public _success: boolean;
    @HostBinding('class.o-button--danger-inverted') public _dangerInverted: boolean;
    @HostBinding('class.o-button--success-inverted') public _successInverted: boolean;
    @HostBinding('class.o-button--dark') public _dark: boolean;
    @HostBinding('class.o-button--link') public _link: boolean;
    @HostBinding('class.o-button--marketplace') public _marketplace: boolean;
    @HostBinding('class.o-button') public get button (): boolean {
        return !this._transparent;
    }

    @ContentChild(BadgeComponent) public childBadge: BadgeComponent;
    @ContentChildren(IconComponent) public childIcons: QueryList<IconComponent>;

    protected debugHelper: DebugHelperModel;

    constructor (
        protected elementRef: ElementRef,
        protected renderer: Renderer,
        private debugHelperService: DebugHelperService,
        @Optional() private stickerComponent: StickerComponent
    ) {
        super();
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ButtonComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        if (this.stickerComponent) {
            this.overlay = true;
        }
        if (this._transparent) {
            if (this._fullWidth) {
                throw new TangramInvalidOptionError(`A tgButton with "transparent" cannot have a "fullWidth" attribute.`, this.debugHelper);
            }
            if (this.size !== undefined) {
                throw new TangramInvalidOptionError(`A tgButton with "transparent" cannot have a "size" attribute.`, this.debugHelper);
            }
        }
        this.initializeLoading();
        this.initializeSize();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initializeLoading(changes);
        this.initializeSize(changes);
    }

    public ngAfterContentInit (): void {
        if (!this.elementRef.nativeElement) {
            return;
        }
        this.hasBadge = !!this.childBadge;
        this.initializeIconClasses();
    }

    private initializeSize (changes?: any): void {
        if (changes && !changes.size || !this.size) { return; }
        this._size = this.size === 'small';
    }
}
