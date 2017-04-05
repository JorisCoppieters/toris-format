import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';

import { coerceBooleanProperty } from '../../form-helpers';
import { CheckboxComponentChange } from './checkbox-change.event';
import { DomHelperService } from '../../../../core/services/dom-helper.service';
import { ValidationMessages } from '../../validation/validation-messages/validation-messages.model';

export const TG_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
};

const DEFAULT_REQUIRED_MESSAGE = 'This is a required value';

@Component({
    selector: 'tg-checkbox',
    templateUrl: 'checkbox.component.html',
    providers: [TG_CHECKBOX_CONTROL_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['checkbox.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
    @HostBinding('class.o-checkbox') true;
    @HostBinding('class.o-checkbox--inline') public _inline: boolean = false;

    @Input() id: string;
    @Input() name: string = null;
    @Input() value: boolean;

    @Output() change: EventEmitter<CheckboxComponentChange> = new EventEmitter<CheckboxComponentChange>();

    @ViewChild('input') inputElement: ElementRef;

    public formInput: FormControl = new FormControl(this.checked);
    public displayValidationMessages: ValidationMessages;

    constructor (
        private changeDetectorRef: ChangeDetectorRef,
        private renderer: Renderer,
        private tgDomHelpers: DomHelperService
    ) {}

    public ngOnInit (): void {
        this.id = this.tgDomHelpers.makeId();
        this.name = this.name || this.id;
        this.displayValidationMessages = {
            required: this.validationMessages
                ? this.validationMessages['required']
                : DEFAULT_REQUIRED_MESSAGE
        };
    }

    private _checked: boolean = false;
    @Input() get checked () {
        return this._checked;
    }
    set checked (checked: boolean) {
        if (checked !== this.checked) {
            this._checked = checked;
            this.changeDetectorRef.markForCheck();
        }
    }

    private _disabled: boolean = false;
    @Input() get disabled (): boolean {
        return this._disabled;
    }
    set disabled (value) {
        this._disabled = coerceBooleanProperty(value);
        this.inputElement.nativeElement.disabled = value;
    }

    @Input() get inline() : boolean {
        return this._inline;
    }
    set inline (value) {
        this._inline = coerceBooleanProperty(value);
    }

    private _required: boolean;
    @Input() get required (): boolean {
        return this._required;
    }
    set required (value) {
        this._required = coerceBooleanProperty(value);
    }

    private _tgValidation: any = null;
    @Input() get validationMessages (): any {
        return this._tgValidation;
    }
    set validationMessages (value) {
        this._tgValidation = value;
    }

    private onTouched: () => any = () => {};

    private controlValueAccessorChangeFn: (value: any) => void = () => {};

    private hasFocus: boolean = false;

    public writeValue (value: any): void {
        this.checked = coerceBooleanProperty(value);
    }

    public registerOnChange (fn: (value: any) => void): void {
        this.controlValueAccessorChangeFn = fn;
    }

    public registerOnTouched (fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState (isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public onInputFocus (): void {
        this.hasFocus = true;
    }

    public onInputBlur (): void {
        this.hasFocus = false;
        this.onTouched();
    }

    public onInputClick (event: Event): void {
        // this prevents the bubbling of the click from the input as the label will also fire a click
        event.stopPropagation();
    }

    public toggle (): void {
        this.checked = !this.checked;
    }

    public onInteractionEvent (event: Event): void {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        if (!this.disabled) {
            this.toggle();

            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this.emitChangeEvent();
        }
    }

    public focus (): void {
        this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus');
        this.onInputFocus();
    }

    public get shouldShowValidation (): boolean {
        return this.required
            && !this.checked
            && (this.formInput.touched
                && this.formInput.dirty);
    }

    private emitChangeEvent (): void {
        let event = new CheckboxComponentChange();
        event.source = this;
        event.checked = this.checked;

        this.controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    }
}