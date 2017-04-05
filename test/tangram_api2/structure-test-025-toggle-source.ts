import {
    Input, HostBinding, ElementRef, OnChanges, OnInit, Component, EventEmitter, Output,
    ChangeDetectionStrategy, forwardRef, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgForm } from '@angular/forms';

import { DebugHelperModel } from '../../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../../core/services/debug-helper.service';
import { ToggleItemComponent } from '../toggle-item/toggle-item.component';
import { TangramMissingValueError } from '../../../../core/errors/tangram-missing-value-error';
import { ToggleComponentChange } from '../toggle-change.event';
import { coerceBooleanProperty } from '../../form-helpers';
import { noop } from 'rxjs/util/noop';
import { TangramMissingElementError } from '../../../../core/errors/tangram-missing-element-error';

// Constants:
const TG_TOGGLE_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true
};

const TOGGLE_CLASS = 'o-toggle';
const TOGGLE_IS_ACTIVE_CLASS = 'o-toggle--is-active';
const TOGGLE_IS_COMPACT_CLASS = 'o-toggle--compact';
const TOGGLE_IS_INVALID_CLASS = 'o-toggle--invalid';

@Component({
    selector: 'tg-toggle',
    templateUrl: 'toggle.component.html',
    providers: [TG_TOGGLE_CONTROL_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../toggle.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ToggleComponent implements ControlValueAccessor, OnInit, OnChanges {
    @HostBinding('class.o-toggle') true; // @Maz: HostBinding with non-existing class. Please review.

    @Input() public compact: boolean;
    @Input() public hideLabel: boolean;
    @Input() public label: string;

    public classes: Array<string>;
    public hasFocus = false;
    public toggleAriaId: string;

    private debugHelper = new DebugHelperModel();
    private toggleItems: Array<ToggleItemComponent> = [];
    private _initialValueHasBeenSet: boolean = false;
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    // [name]
    @Input('name') public toggleId: string;

    // (change)
    @Output() public change: EventEmitter<ToggleComponentChange> = new EventEmitter<ToggleComponentChange>();

    // [required]
    private _required: boolean;
    @Input() public get required (): boolean {
        return this._required;
    }
    public set required (value) {
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
            this.updateCheckedStateInToggleItems();
            this._initialValueHasBeenSet = true;
        }
    }

    constructor (
        public form: NgForm,
        _debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        if (_debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ToggleComponent,
                element: elementRef
            };
        }
        this.toggleAriaId = `aria-${this.toggleId}`;
    }

    public addToggleItem (toggleItem: ToggleItemComponent): void {
        this.toggleItems.push(toggleItem);
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initialiseClasses();
    }

    public ngOnInit (): void {
        this.validate();
        this.initialiseClasses();
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

    public markTouched (): void {
        this.onTouchedCallback();
    }

    public updateFocus (): void {
        this.hasFocus = this.toggleItems
            .some(toggle => toggle.hasFocus);
    }

    public get shouldShowValidation (): boolean {
        if (this.form.controls && this.form.controls[this.toggleId]) {
            let formControl = this.form.controls[this.toggleId];
            return formControl.invalid && (formControl.touched || formControl.dirty || this.form.submitted);
        }
        return false;
    }

    private updateCheckedStateInToggleItems (): void {
        this.toggleItems
            .forEach((toggle) => {
                toggle.checked = (this._value === toggle.value);
            });
    }

    private emitChangeEvent (): void {
        let event = new ToggleComponentChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    }

    private initialiseClasses (): void {
        let newClasses: Array<string> = [TOGGLE_CLASS];

        if (this.hasFocus) {
            newClasses.push(TOGGLE_IS_ACTIVE_CLASS);
        }
        if (this.compact) {
            newClasses.push(TOGGLE_IS_COMPACT_CLASS);
        }
        if (this.shouldShowValidation) {
            newClasses.push(TOGGLE_IS_INVALID_CLASS);
        }
        this.classes = newClasses;
    }

    private validate (): void {
        if (!this.label) {
            throw new TangramMissingValueError(this.label, 'label', this.debugHelper);
        }
        if (!this.form) {
            throw new TangramMissingElementError('<form>', 'tg-toggle should be wrapped in a form element', this.debugHelper);
        }
    }
}
