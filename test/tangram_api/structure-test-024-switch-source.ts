import {
    OnInit, Component, Input, ViewChild, ElementRef, Output, EventEmitter, forwardRef,
    OnChanges, SimpleChanges, HostBinding, ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgForm } from '@angular/forms';

import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { coerceBooleanProperty } from '../form-helpers';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DomHelperService } from '../../../core/services/dom-helper.service';
import { TangramMissingElementError } from '../../../core/errors/tangram-missing-element-error';
import { noop } from 'rxjs/util/noop';

import { SwitchChange } from './switch-change.event';

// Constants:
const TG_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true
};

@Component({
    selector: 'tg-switch',
    templateUrl: './switch.component.html',
    providers: [TG_SWITCH_CONTROL_VALUE_ACCESSOR],
    styleUrls: ['./switch.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SwitchComponent implements ControlValueAccessor, OnInit, OnChanges {
    @HostBinding('class.o-switch') public isApplied: boolean = true;

    @ViewChild('input') public inputElement: ElementRef;

    // [name]
    @Input('name') public switchId: string;

    // [label]
    @Input('label') public label: string;

    // [disabled]
    public isDisabled: boolean = false;
    @Input() public get disabled (): boolean {
        return this.isDisabled;
    }
    public set disabled (value) {
        this.isDisabled = coerceBooleanProperty(value);
        this.inputElement.nativeElement.disabled = value;
    }

    // [inline]
    @Input('inline') public set inline (value: boolean) {
        this.isInline = coerceBooleanProperty(value);
    }

    @HostBinding('class.o-switch--right-inline')
    public isInline: boolean = false;

    // [value]
    private _selected: any = null;
    public get selected (): any {
        return this._selected;
    }
    public set selected (newValue: any) {
        if (this._selected !== newValue || this._initialValueHasBeenSet === false) {
            this._selected = newValue;
            this.onChangeCallback(newValue);
            this.emitChangeEvent();
            this._initialValueHasBeenSet = true;
        }
    }

    // (blur), (change), (click), (focus)
    @Output('change') public change$: EventEmitter<SwitchChange> = new EventEmitter<SwitchChange>();
    @Output('blur') public blur$: EventEmitter<SwitchComponent> = new EventEmitter<SwitchComponent>();
    @Output('click') public click$: EventEmitter<SwitchComponent> = new EventEmitter<SwitchComponent>();
    @Output('focus') public focus$: EventEmitter<SwitchComponent> = new EventEmitter<SwitchComponent>();

    private debugHelper: DebugHelperModel;
    private _initialValueHasBeenSet: boolean = false;
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor (
        public form: NgForm,
        debugHelperService: DebugHelperService,
        domHelperService: DomHelperService,
        elementRef: ElementRef
    ) {
        this.switchId = domHelperService.makeId();

        if (debugHelperService.isEnabled) {
            this.debugHelper = {
                component: SwitchComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.ngOnInit();
    }

    public onBlur (): void {
        this.blur$.emit(this);
    }

    public onFocus (): void {
        this.focus$.emit(this);
    }

    public onClick (event: Event): void {
        event.stopPropagation();
        this.onTouchedCallback();
        this.click$.emit(this);
    }

    public onChange (event: Event): void {
        event.stopPropagation();

        if (!this.disabled) {
            this.selected = !this.selected;
        }
    }

    public writeValue (selected: any): void {
        this.selected = selected;
    }

    public registerOnChange (fn: any): void {
        this.onChangeCallback = fn;
    }

    public registerOnTouched (fn: any): void {
        this.onTouchedCallback = fn;
    }

    private emitChangeEvent (): void {
        let event = new SwitchChange();
        event.source = this;
        event.selected = this._selected;
        this.change$.emit(event);
    }

    private validate (): void {
        if (!this.form) {
            throw new TangramMissingElementError('<form>', 'tg-radio-group should be wrapped in a form element', this.debugHelper);
        }

        if (!this.label) {
            throw new TangramMissingElementError('<form>', '<tg-switch> was used without a "label" value', this.debugHelper);
        }
    }
}
