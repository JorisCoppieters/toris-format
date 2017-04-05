import {
    ElementRef, HostBinding, Component, EventEmitter, Output, forwardRef, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgForm } from '@angular/forms';
import { noop } from 'rxjs/util/noop';

import { DebugHelperModel } from '../../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../../core/services/debug-helper.service';
import { RadioChange } from '../radio-change.event';
import { RadioItemComponent } from '../radio-item/radio-item.component';
import { coerceBooleanProperty } from '../../form-helpers';
import { TangramMissingElementError } from '../../../../core/errors/tangram-missing-element-error';

// Constants:
const TG_RADIO_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioGroupComponent),
    multi: true
};

@Component({
    selector: 'tg-radio-group',
    templateUrl: 'radio-group.component.html',
    providers: [TG_RADIO_CONTROL_VALUE_ACCESSOR],
    styleUrls: ['../radio.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RadioGroupComponent implements ControlValueAccessor, OnInit, OnChanges {
    @HostBinding('class.o-radio-group') true; // @Maz: HostBinding with non-existing class. Please review.

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    private debugHelper = new DebugHelperModel();
    private radioItems: Array<RadioItemComponent> = [];
    private _initialValueHasBeenSet: boolean = false;

    // [name]
    @Input('name') public radioGroupId: string;

    // (change)
    @Output() public change: EventEmitter<RadioChange> = new EventEmitter<RadioChange>();

    // [required]
    private _required: boolean;
    public get required (): boolean {
        return this._required;
    }
    @Input() public set required (value) {
        this._required = coerceBooleanProperty(value);
    }

    private _value: any = null;
    public get value (): any {
        return this._value;
    }
    public set value (newValue: any) {
        if (this._value !== newValue || this._initialValueHasBeenSet === false) {
            this._value = newValue;
            this.onChangeCallback(newValue);
            this.emitChangeEvent();
            this.updateCheckedStateInRadioItems();
            this._initialValueHasBeenSet = true;
        }
    }

    constructor (
        public form: NgForm,
        debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        if (debugHelperService.isEnabled) {
            this.debugHelper = {
                component: RadioItemComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
    }

    public addRadioItem (radioItem: RadioItemComponent): void {
        this.radioItems.push(radioItem);
    }

    public markTouched (): void {
        this.onTouchedCallback();
    }

    private updateCheckedStateInRadioItems (): void {
        this.radioItems
            .forEach((radio) => {
                radio.checked = (this._value === radio.value);
            });
    }

    public get shouldShowValidation (): boolean {
        if (this.form.controls && this.form.controls[this.radioGroupId]) {
            let formControl = this.form.controls[this.radioGroupId];
            return formControl.invalid && (formControl.touched || formControl.dirty || this.form.submitted);
        }

        return false;
    }

    public writeValue (value: any): void {
        this.value = value;
    }

    public registerOnChange (fn: any): void {
        this.onChangeCallback = fn;
    }

    public registerOnTouched (fn: any): void {
        this.onTouchedCallback = fn;
    }

    private emitChangeEvent (): void {
        let event = new RadioChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    }

    private validate (): void {
        if (!this.form) {
            throw new TangramMissingElementError('<form>', 'tg-radio-group should be wrapped in a form element', this.debugHelper);
        }
    }
}
