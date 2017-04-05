import {
    Component, Input, OnInit, ElementRef, ViewChild,
    Inject, forwardRef, EventEmitter, Output, HostBinding
} from '@angular/core';

import { DebugHelperModel } from '../../../../core/models/debug-helper.model';
import { coerceBooleanProperty } from '../../form-helpers';
import { DomHelperService } from '../../../../core/services/dom-helper.service';
import { DebugHelperService } from '../../../../core/services/debug-helper.service';
import { RadioGroupComponent } from '../radio-group/radio-group.component';

@Component({
    selector: 'tg-radio-item',
    templateUrl: 'radio-item.component.html'
})
export class RadioItemComponent implements OnInit {
    @HostBinding('class.o-radio') public isApplied: boolean = true;

    public radioItemId: string;
    public checked: boolean = false;

    // [value]
    @Input() public value: any;
    @ViewChild('input') public inputElement: ElementRef;

    // (blur), (change), (click), (focus)
    @Output('blur') public blur$: EventEmitter<RadioItemComponent> = new EventEmitter<RadioItemComponent>();
    @Output('change') public change$: EventEmitter<RadioItemComponent> = new EventEmitter<RadioItemComponent>();
    @Output('click') public click$: EventEmitter<RadioItemComponent> = new EventEmitter<RadioItemComponent>();
    @Output('focus') public focus$: EventEmitter<RadioItemComponent> = new EventEmitter<RadioItemComponent>();

    private debugHelper: DebugHelperModel;

    // [disabled]
    private _disabled: boolean = false;
    @Input() public set disabled (value) {
        this._disabled = coerceBooleanProperty(value);
        this.inputElement.nativeElement.disabled = this._disabled;
    }
    public get disabled (): boolean {
        return this._disabled;
    }

    constructor (
        @Inject(forwardRef(() => RadioGroupComponent)) public tgRadioGroup: RadioGroupComponent,
        debugHelperService: DebugHelperService,
        domHelperService: DomHelperService,
        elementRef: ElementRef
    ) {
        this.radioItemId = domHelperService.makeId();

        if (debugHelperService.isEnabled) {
            this.debugHelper = {
                component: RadioItemComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        // add to parent
        this.tgRadioGroup.addRadioItem(this);
    }

    public onBlur (): void {
        this.blur$.emit(this);
    }

    public onFocus (): void {
        this.focus$.emit(this);
        this.tgRadioGroup.markTouched();
    }

    public onClick (event: Event): void {
        event.stopPropagation();
        this.click$.emit(this);
    }

    public onChange (event: Event): void {
        event.stopPropagation();

        if (!this.disabled) {
            this.tgRadioGroup.value = this.value;
            this.change$.emit(this);
        }
    }
}
