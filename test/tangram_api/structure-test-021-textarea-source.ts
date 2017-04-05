import { OnInit, ElementRef, Component, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import { InputContainerComponent } from '../input-container/input-container.component';
import { ValidationMessages } from '../../validation/validation-messages/validation-messages.model';

@Component({
    selector: 'textarea[tgTextInput]',
    template: '<ng-content></ng-content>',
    styleUrls: ['textarea.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TextAreaComponent implements OnInit, OnChanges {
    @Input() validationMessages: ValidationMessages;

    constructor (
        private elementRef: ElementRef,
        private inputContainerComponent: InputContainerComponent
    ) {}

    public ngOnInit () {
        this.inputContainerComponent.registerInputElementRef(this.elementRef);
        this.inputContainerComponent.registerValidationMessages(this.validationMessages);
    }

    public ngOnChanges (changes: SimpleChanges): void {
        if ('options' in changes) {
            this.inputContainerComponent.registerValidationMessages(this.validationMessages);
        }
    }
}