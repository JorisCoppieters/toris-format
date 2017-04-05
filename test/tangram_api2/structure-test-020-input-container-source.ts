import { Component, ContentChild, Optional, Input, ElementRef, OnInit, Renderer, AfterContentInit, forwardRef, Inject, ViewEncapsulation, HostBinding } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';

// Dependencies:
import { ValidationMessages } from '../../validation/validation-messages/validation-messages.model';
import { DomHelperService } from '../../../../core/services/dom-helper.service';
import { MaxCharactersValidatorDirective } from '../../validation/validator-directives/max-characters-validator.directive';
import { coerceBooleanProperty } from '../../form-helpers';
import { TangramMissingValueError } from '../../../../core/errors/tangram-missing-value-error';
import { DebugHelperService } from '../../../../core/services/debug-helper.service';
import { DebugHelperModel } from '../../../../core/models/debug-helper.model';
import { TangramMissingElementError } from '../../../../core/errors/tangram-missing-element-error';
import { ValidationGroupComponent } from '../../validation/validation-group/validation-group.component';
import { RadioItemComponent } from '../../radio/radio-item/radio-item.component';

const MAX_CHARACTERS = 'maxCharacters';

@Component({
    selector: 'tg-input-container',
    templateUrl: './input-container.component.html',
    styleUrls: ['./input-container.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class InputContainerComponent implements OnInit, AfterContentInit {

    @Input()
    public set clearable (value) {
        this._clearable = coerceBooleanProperty(value);
    }

    @Input()
    public set compact (value) {
        this._compact = coerceBooleanProperty(value);
    }

    @Input()
    public set inline (value) {
        this._inline = coerceBooleanProperty(value);
    }

    @Input()
    public set hideLabel (value) {
        this._hideLabel = coerceBooleanProperty(value);
    }

    @Input()
    public set showMultipleValidationMessages (value) {
        this._showMultipleValidationMessages = coerceBooleanProperty(value);
    }

    @Input()
    public set hideValidation (value) {
        this._hideValidation = coerceBooleanProperty(value);
    }

    @Input() public description: string;
    @Input() public iconLeft: string;
    @Input() public iconLeftAlt: string;
    @Input() public iconRight: string;
    @Input() public iconRightAlt: string;
    @Input() public inputWidth: string;
    @Input() public label: string;

    @HostBinding('class.o-input') public isApplied: boolean = true;

    @HostBinding('class.o-input--is-read-only')
    public get isReadOnly (): boolean {
        return this.inputElement.nativeElement && this.inputElement.nativeElement.readonly;
    }

    @HostBinding('class.o-input--invalid')
    public get invalid (): boolean {
        return this.input.invalid && this.shouldShowValidation;
    }

    @HostBinding('class.o-input--valid')
    public get valid (): boolean {
        return this.input.valid && this.shouldShowValidation;
    }

    @HostBinding('class.o-input--is-disabled')
    public get disabled (): boolean {
        return this.input.disabled;
    }

    @HostBinding('class.o-input--is-focused')
    public isFocused: boolean;

    @HostBinding('class.o-input--nested')
    public get nestedInRadioItem (): boolean {
        return !!this.radioItem;
    }

    @HostBinding('class.o-input--text-area')
    public isTextArea: boolean;

    @HostBinding('class.o-input--text')
    public get notTextArea (): boolean {
        return !this.isTextArea;
    }

    @HostBinding('class.o-input__optional')
    public get isOptional (): boolean {
        if (this.inputElement.nativeElement) {
            return !this.inputElement.nativeElement.required;
        }
        return true;
    }

    @HostBinding('class.o-input--clearable')
    public _clearable: boolean;

    @HostBinding('class.o-input--inline-compact')
    public _compact: boolean;

    @HostBinding('class.o-input--inline')
    public _inline: boolean;

    public _hideLabel: boolean;
    public _showMultipleValidationMessages: boolean;
    public _hideValidation: boolean;
    public _validationMessages: ValidationMessages;
    public inputId: string;
    public inputElementRef: ElementRef;

    @ContentChild(NgControl) public input: NgControl;
    @ContentChild(MaxCharactersValidatorDirective) public maxCharactersValidator: MaxCharactersValidatorDirective;

    private debugHelper: DebugHelperModel;
    private textAreaElementRef: ElementRef;

    constructor (
        @Optional() public form: NgForm,
        @Optional() public radioItem: RadioItemComponent,
        @Optional() @Inject(forwardRef(() => ValidationGroupComponent)) private validationGroup,
        private domHelperService: DomHelperService,
        private renderer: Renderer,
        debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        if (debugHelperService.isEnabled) {
            this.debugHelper = {
                component: InputContainerComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit () {
        if (!this.label) {
            throw new TangramMissingValueError(this.label, 'label', this.debugHelper);
        }
        if (this.validationGroup) {
            this.validationGroup.registerInputContainer(this);
        }
    }

    public ngAfterContentInit () {
        if (!this.inputElement) {
            throw new TangramMissingElementError('<tg-input-container>', 'input or textarea', this.debugHelper);
        }
    }

    public registerValidationMessages (validationMessages: ValidationMessages): void {
        this._validationMessages = validationMessages;
    }

    public get validationMessages (): ValidationMessages {
        return this._validationMessages;
    }

    public registerInputElementRef (elementRef: ElementRef) {
        this.inputElementRef = elementRef;
        this.isTextArea = false;
        this.setupIdForLabels();
        this.setupFocusListener();
    }

    public registerTextInputElementRef (elementRef: ElementRef) {
        this.textAreaElementRef = elementRef;
        this.isTextArea = true;
        this.setupIdForLabels();
        this.setupFocusListener();
    }

    private setupIdForLabels () {
        if (!this.inputElement.nativeElement) {
            return;
        }
        if (this.inputElement.nativeElement.getAttribute('id')) {
            this.inputId = this.inputElement.nativeElement.getAttribute('id');
        } else {
            this.inputId = this.domHelperService.makeId(this.label);
            this.renderer.setElementAttribute(this.inputElement.nativeElement, 'id', this.inputId);
        }
    }

    private setupFocusListener () {
        this.renderer.listen(this.inputElement.nativeElement, 'focus', () => {
            this.isFocused = true;
        });
        this.renderer.listen(this.inputElement.nativeElement, 'blur', () => {
            this.isFocused = false;
        });
    }

    public clear (): void {
        this.input.control.setValue(null);
        this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus');
    }

    public get inputWidthModifierClass (): string {
        return this.inputWidth
            ? `h-width-mod-${this.inputWidth}`
            : null;
    }

    private get inputElement (): ElementRef {
        return this.inputElementRef || this.textAreaElementRef;
    }

    public get shouldShowValidationMessage (): boolean {
        return !this._hideValidation
            && this.shouldShowValidation;
    }

    public get shouldShowValidation (): boolean {
        return this.input
            && this.input.validator
            && !this.input.disabled
            && this.input.invalid
            && (this.input.value
            || this.input.touched
            || this.input.dirty
            || (this.form && this.form.submitted));
    }

    public get maxCharacters (): number {
        return this.maxCharactersValidator ? this.maxCharactersValidator.maxCharacters : 0;
    }

    public get remainingCharacters (): number {
        return this.maxCharacters - (this.input && this.input.value || '').length;
    }

    public get maxCharactersError () {
        return this.input.errors && this.input.errors[MAX_CHARACTERS];
    }

    public get showMaxCharacters (): boolean {
        return this.maxCharacters && !this.maxCharactersError;
    }
}
