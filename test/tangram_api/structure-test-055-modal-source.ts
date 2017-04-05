import {
    Component, EventEmitter, Output, Input, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';

import { coerceBooleanProperty } from '../../forms/form-helpers';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DomHelperService } from '../../../core/services/dom-helper.service';
import { EnumHelperService } from '../../../core/services/enum-helper.service';
import { ModalBreakpointEnum } from './modal-breakpoint.enum';
import { ModalSizeEnum } from './modal-size.enum';
import { TangramInvalidOptionError } from '../../../core/errors/tangram-invalid-option-error';
import { WindowRef } from '../../../core/window-ref';

const ESC_KEY_CODE = 27;
const SCROLL_LOCK_CLASS = 'h-scroll-lock';

@Component({
    selector: 'tg-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['./modal.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {

    // [size]
    @Input() public size: ModalSizeEnum = ModalSizeEnum.normal;

    // [fullWidth]
    @Input() set fullWidth (value: boolean) {
        this._fullWidth = coerceBooleanProperty(value);
    }
    get fullWidth (): boolean {
        return this._fullWidth;
    }
    private _fullWidth: boolean;

    // [fullScreen]
    @Input() set fullScreen (value: boolean) {
        this._fullScreen = value;
    }
    get fullScreen (): boolean {
        return this._fullScreen;
    }
    private _fullScreen: boolean;

    // [required]
    @Input()
    set required (value) {
        this._required = coerceBooleanProperty(value);
    }
    get required (): boolean {
        return this._required;
    }
    private _required: boolean;

    // [(show)]
    @Input()
    public set show (newValue: boolean) {
        if (newValue === true && this._show === false) {
            this.open();
        } else if (newValue === false && this._show === true) {
            this.modalCleanUp();
        }
        this._show = newValue;
        this.showChange.emit(this._show);
    }
    public get show () {
        return this._show;
    }
    @Output() public showChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    private _show: boolean;

    // #modalRow
    @ViewChild('modalRow') public modalRow: Element;

    public breakpointEnum: typeof ModalBreakpointEnum = ModalBreakpointEnum;
    public ariaLabelledbyId: string;
    public ariaDescribedbyId: string;

    private currentScroll: number;
    private debugHelper: DebugHelperModel;
    private modalColumns: { [index: number]: Array<number> } = {
        [ModalSizeEnum.normal]: [ 12, 6, 6, 4 ],
        [ModalSizeEnum.wide]: [ 12, 8, 8, 6 ],
        [ModalSizeEnum.wider]: [ 12, 10, 10, 8 ]
    };

    constructor (
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService,
        private elementRef: ElementRef,
        private enumHelperService: EnumHelperService,
        private windowRef: WindowRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ModalComponent,
                element: elementRef
            };
        }

        this.ariaLabelledbyId = domHelperService.makeId();
        this.ariaDescribedbyId = domHelperService.makeId();
    }

    public ngOnInit (): void {
        this.validate();
    }

    public ngOnDestroy (): void {
        if (this.show) {
            this.modalCleanUp();
        }
    }

    public closeIfNotRequired () {
        if (!this.required) {
            this.show = false;
        }
    }

    public getModalColumns (breakpoint: ModalBreakpointEnum): number {
        if (typeof this.size === 'string') {
            this.size = this.enumHelperService.validate<typeof ModalSizeEnum>(ModalSizeEnum, this.size, this.debugHelper);
        }

        return this.modalColumns[ this.size ][ breakpoint ];
    }

    public getModalOffset (breakPoint: ModalBreakpointEnum): number {
        let colCount: number = this.getModalColumns(breakPoint);
        return this.getOffset(colCount);
    }

    private onKeyDown = (event) => {
        if (event.keyCode === ESC_KEY_CODE) {
            this.closeIfNotRequired();
        }
    };

    private open (): void {
        this.modalRow.scrollTop = 0;
        this.windowRef.nativeWindow.addEventListener('keydown', this.onKeyDown);

        this.currentScroll = this.windowRef.nativeWindow.pageYOffset;
        document.body.style.top = -this.currentScroll + 'px';
        document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    }

    private modalCleanUp = (): void => {
        this.windowRef.nativeWindow.removeEventListener('keydown', this.onKeyDown);
        document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
        document.body.style.top = '';
        document.body.scrollTop = this.currentScroll;
    };

    private getOffset (colCount: number): number {
        return (12 - colCount) / 2;
    }

    private validate (): void {
        if (this.size) {
            this.enumHelperService.validate<typeof ModalSizeEnum>(ModalSizeEnum, this.size, this.debugHelper);
        }

        if (this.show !== true && this.show !== false) {
            throw new TangramInvalidOptionError(`'show' on a tg-modal cannot be undefined`, this.debugHelper);
        }
    }
}
