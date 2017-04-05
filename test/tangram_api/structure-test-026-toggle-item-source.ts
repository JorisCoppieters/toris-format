import {
    Component, Input, OnInit, ElementRef, ViewChild,
    Inject, EventEmitter, Output, forwardRef, HostBinding
} from '@angular/core';
import { ToggleComponent } from '../toggle/toggle.component';
import { DomHelperService } from '../../../../core/services/dom-helper.service';
import { DebugHelperModel } from '../../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../../core/services/debug-helper.service';
import { coerceBooleanProperty } from '../../form-helpers';

@Component({
    selector: 'tg-toggle-item',
    templateUrl: 'toggle-item.component.html'
})
export class ToggleItemComponent implements OnInit {
    @HostBinding('class.o-toggle__item') public isApplied: boolean = true;

    public toggleItemId: string;
    public checked: boolean = false;
    public hasFocus: boolean = false;

    // [value]
    @Input() public value: any;
    @ViewChild('input') public inputElement: ElementRef;

    // (blur), (change), (click), (focus)
    @Output('blur') public blur$: EventEmitter<ToggleItemComponent> = new EventEmitter<ToggleItemComponent>();
    @Output('change') public change$: EventEmitter<ToggleItemComponent> = new EventEmitter<ToggleItemComponent>();
    @Output('click') public click$: EventEmitter<ToggleItemComponent> = new EventEmitter<ToggleItemComponent>();
    @Output('focus') public focus$: EventEmitter<ToggleItemComponent> = new EventEmitter<ToggleItemComponent>();

    private debugHelper: DebugHelperModel;

    // [disabled]
    private _disabled: boolean = false;
    @Input() public get disabled (): boolean {
        return this._disabled;
    }
    public set disabled (value) {
        this._disabled = coerceBooleanProperty(value);
        this.inputElement.nativeElement.disabled = value;
    }

    constructor (
        @Inject(forwardRef(() => ToggleComponent)) public tgToggle: ToggleComponent,
        debugHelperService: DebugHelperService,
        domHelperService: DomHelperService,
        elementRef: ElementRef
    ) {
        this.toggleItemId = domHelperService.makeId();

        if (debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ToggleItemComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        // add to parent
        this.tgToggle.addToggleItem(this);
    }

    public onBlur (): void {
        this.hasFocus = false;
        this.blur$.emit(this);
        this.tgToggle.updateFocus();
    }

    public onFocus (): void {
        this.focus$.emit(this);
        this.hasFocus = true;
        this.tgToggle.markTouched();
        this.tgToggle.updateFocus();
    }

    public onClick (event: Event): void {
        event.stopPropagation();
        this.click$.emit(this);
    }

    public onChange (event: Event): void {
        event.stopPropagation();

        if (!this.disabled) {
            this.tgToggle.value = this.value;
            this.change$.emit(this);
        }
    }
}
