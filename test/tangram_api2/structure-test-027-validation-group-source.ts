import { Component, Input, ElementRef, OnDestroy, OnInit, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { DomHelperService } from '../../../../core/services/dom-helper.service';
import { InputContainerComponent } from '../../inputs/input-container/input-container.component';
import { ErrorMessagesPipe } from '../validation-messages/error-messages.pipe';
import { TangramInvalidOptionError } from '../../../../core/errors/tangram-invalid-option-error';
import { DebugHelperService } from '../../../../core/services/debug-helper.service';
import { DebugHelperModel } from '../../../../core/models/debug-helper.model';
import { isFunction } from 'rxjs/util/isFunction';
import { Observable } from 'rxjs';
import { TgValidators } from '../validator-directives/validators';

@Component({
    selector: 'tg-validation-group',
    templateUrl: './validation-group.component.html',
    styleUrls: ['./validation-group.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ValidationGroupComponent implements OnInit, OnDestroy, AfterContentInit {
    @Input() public name: string;
    @Input() public title: string;
    @Input() public validation: any;
    @Input() public validationSummaryMessage: string;

    public id: string;
    public groupErrorMessages = [];
    public invalidInputs = {};
    public invalidInputsKeys = [];

    public get showErrorMessages (): boolean {
        return this.formGroup.invalid
            && (Object.keys(this.inputContainers).some((key) => {
                return this.inputContainers[key].input.invalid
                    && (this.inputContainers[key].input.touched || this.inputContainers[key].input.dirty);
                    })
                || this.form.submitted
                || !!this.groupErrorMessages.length);
    }

    private debugHelper: DebugHelperModel;
    private errorPipe: ErrorMessagesPipe;
    private formGroup: FormGroup;
    private inputContainers: Array<InputContainerComponent> = [];
    private subscriptions = [];

    constructor (
        private debugHelperService: DebugHelperService,
        private domHelpers: DomHelperService,
        private elementRef: ElementRef,
        private fb: FormBuilder,
        private form: NgForm
    ) {}

    public ngOnInit () {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ValidationGroupComponent,
                element: this.elementRef
            };
        }
        if (this.name == null) {
            throw new TangramInvalidOptionError('<tg-validation-group> was used without a "tg-name" value', this.debugHelper);
        }
        if (this.title == null) {
            throw new TangramInvalidOptionError('<tg-validation-group> was used without a "tg-title" value', this.debugHelper);
        }
        this.id = `${this.domHelpers.makeId(this.name)}-${this.domHelpers.makeId()}`;
        this.errorPipe = new ErrorMessagesPipe();
    }

    public ngAfterContentInit () {
        this.setupFormGroup();
        this.setupSubscriptions();
    }

    public ngOnDestroy () {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public registerInputContainer (inputContainer: InputContainerComponent) {
        this.inputContainers.push(inputContainer);
    }

    private setupFormGroup () {
        let controlGroup = {};

        this.inputContainers
            .forEach(inputContainer => controlGroup[inputContainer.input.name] = inputContainer.input.control);

        this.formGroup = this.fb.group(controlGroup, { validator: Validators.compose(this.getGroupValidators()) });
    }

    private setupSubscriptions () {
        this.inputContainers.forEach(inputContainer => {
            inputContainer.hideValidation = true;
            let { input } = inputContainer;

            this.subscriptions.push(
                input.statusChanges
                    .subscribe(() => this.getInputErrorMessages(inputContainer)),
                input.valueChanges
                    .subscribe(() => this.getGroupErrorMessages()),
                this.form.ngSubmit
                    .subscribe(() => this.getInputErrorMessages(inputContainer)),
                Observable
                    .fromEvent(inputContainer.inputElementRef.nativeElement, 'blur')
                    .first()
                    .subscribe(() => this.getInputErrorMessages(inputContainer))
            );
        });
    }

    private getInputErrorMessages (inputContainer): void {

        let { input } = inputContainer;

        if (input.valid) {
            if (!this.invalidInputs[input.name]) { return; }
            delete this.invalidInputs[input.name];

            this.invalidInputsKeys = Object.keys(this.invalidInputs);

        } else if (input.invalid && (input.dirty || input.touched || this.form.submitted)) {
            this.invalidInputs[input.name] = {
                errorMessages: this.errorPipe.transform(input.errors, inputContainer.displayValidationMessages)
            };
            this.invalidInputsKeys = Object.keys(this.invalidInputs);
        }
    }

    private getGroupErrorMessages (): void {

        this.formGroup.updateValueAndValidity({ onlySelf: true });
        if (!this.validation) { return; }

        this.groupErrorMessages =
            Object.keys(this.validation)
                .map(name => {
                    return this.formGroup.errors && this.formGroup.errors[name]
                        ? this.validation[name].message
                        : null;
                })
                .filter(Boolean);
    }

    private getGroupValidators () {
        let validators = [TgValidators.validateRequireValidGroupFactory];
        if (!this.validation) { return validators; }

        Object.keys(this.validation)
            .forEach(name => {
                let validator = this.validation[name];
                if (!validator.message) {
                    throw new TangramInvalidOptionError(`<tg-validation-group> was used with an invalid tg-validation object. The ${name} property doesn't have a 'message:' value`, this.debugHelper);
                }
                if (!validator.value || !isFunction(validator.value)) {
                    throw new TangramInvalidOptionError(`<tg-validation-group> was used with an invalid tg-validation object. The ${name} property doesn't have a function as it's 'value:'`, this.debugHelper);
                }
                validators.push(this.validation[name].value);
            });
        return validators;
    }
}
