// Angular:
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { OnChanges, OnDestroy, OnInit } from '@angular/core';

// Dependencies:
import { coerceBooleanProperty } from '../../forms/form-helpers';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService } from '../../../core/services';
import { StepIndicatorComponent } from '../step-indicator/step-indicator.component';
import { TeleporterSourceDirective } from '../../teleporter/source/source.directive';

@Component({
    selector: 'tg-step-indicator-item',
    templateUrl: 'step-indicator-item.component.html'
})
export class StepIndicatorItemComponent implements OnChanges, OnDestroy, OnInit {
    @Input() public set active (value: boolean) {
        this.isActive = coerceBooleanProperty(value);
    }

    @Input() public set disabled (value: boolean) {
        this.isDisabled = coerceBooleanProperty(value);
    }

    @Input() public displayName: string;
    @Input() public iconName: string;
    @Input() public iconStyle: string;

    @ViewChild('contentSource') public contentSource: TeleporterSourceDirective;

    public isActive: boolean = false;
    public isDisabled: boolean = false;
    private debugHelper: DebugHelperModel;

    constructor (
        public stepIndicatorComponent: StepIndicatorComponent,
        debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        if (debugHelperService.isEnabled) {
            this.debugHelper = {
                component: StepIndicatorItemComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.stepIndicatorComponent.addItem(this);
        this.initialiseState();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseState();
    }

    public ngOnDestroy (): void {
        this.stepIndicatorComponent.removeItem(this);
    }

    public select (): void {
        this.stepIndicatorComponent.select(this);
    }

    private initialiseState (): void {
        if (this.isActive) {
            this.select();
        }
    }
}
