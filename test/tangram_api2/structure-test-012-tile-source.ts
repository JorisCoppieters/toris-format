import {
    Input,
    OnInit,
    ElementRef,
    ContentChildren,
    QueryList, Renderer, OnChanges, AfterContentInit, HostBinding, Component, ViewEncapsulation
} from '@angular/core';

import { TangramInvalidOptionError } from '../../../core/errors/tangram-invalid-option-error';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { IconComponent } from '../../icons/icon/icon.component';
import { Observable } from 'rxjs/Observable';
import { coerceBooleanProperty } from '../../forms/form-helpers';
import { AbstractButtonClass } from '../abstract-button.class';
import { TileHeightEnum } from './tile-height.enum';
import { DomHelperService } from '../../../core/services/dom-helper.service';

const TILE_HEIGHT_CLASS = 'o-tile-button--set-height-';

@Component({
    selector: 'tg-tile-button, a[tgTileButton], button[tgTileButton], div[tgTileButton]',
    template: '<ng-content></ng-content>',
    styleUrls: ['./tile-button.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TileComponent extends AbstractButtonClass implements OnInit, OnChanges, AfterContentInit {

    @Input() public loading: Promise<any> | Observable<any>;
    @Input() public tileHeight: string;
    @Input() public set highlight (value) {
        this._highlight = coerceBooleanProperty(value);
    }
    @Input() public set dashed (value) {
        this._dashed = coerceBooleanProperty(value);
    }
    @Input() public set active (value) {
        this._active = coerceBooleanProperty(value);
    }
    @Input() public set compact (value) {
        this._compact = coerceBooleanProperty(value);
    }
    @Input() public set stackIcon (value) {
        this._stackIcon = coerceBooleanProperty(value);
    }
    @HostBinding('class.o-tile-button--highlight') public _highlight: boolean;
    @HostBinding('class.o-tile-button--is-active') public _active: boolean;
    @HostBinding('class.m--compact') public _compact: boolean;
    @HostBinding('class.o-tile-button--stack') public _stackIcon: boolean;
    @HostBinding('class.o-button--loading') public _loading: boolean;
    @HostBinding('class.o-tile-button--dashed') public _dashed: boolean;
    @HostBinding('class.o-button--icon-only') public iconOnly: boolean;
    @HostBinding('class.o-button--icon-on-left') public iconOnLeft: boolean;
    @HostBinding('class.o-button--icon-on-right') public iconOnRight: boolean;
    @HostBinding('class.o-button--icon-on-left-and-right') public iconOnLeftAndRight: boolean;

    @HostBinding('class.o-tile-button') true;

    @ContentChildren(IconComponent) public childIcons: QueryList<IconComponent>;
    protected debugHelper: DebugHelperModel;

    constructor (
        protected elementRef: ElementRef,
        protected renderer: Renderer,
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService
    ) {
        super();
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: TileComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit () {
        this.initializeLoading();
        this.initializeTileHeight();
    }

    public ngOnChanges (changes: any) {
        this.initializeLoading(changes);
        this.initializeTileHeight(changes);
    }

    public ngAfterContentInit () {
        if (!this.elementRef.nativeElement) {
            return;
        }
        let childNodes = this.getFilteredChildNodes();

        if (this.stackIcon && this.childIcons.length && this.isIcon(childNodes)) {
            throw new TangramInvalidOptionError(`A <button tgTileButton> with stackIcon="true" cannot also have iconRight="true" attribute.`, this.debugHelper);
        }
        this.initializeIconClasses();
    }

    public initializeTileHeight (changes?: any) {
        if (changes && !changes.tileHeight) { return; }

        this.domHelperService.applyClassFromEnum(this.elementRef, this.renderer, TILE_HEIGHT_CLASS, this.tileHeight, TileHeightEnum);
    };
}
