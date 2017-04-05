// Angular:
import { AfterContentInit, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { coerceBooleanProperty } from '../../forms/form-helpers';
import { Collection } from '../../../core/behaviours';
import { EnumHelperService } from '../../../core/services/enum-helper.service';
import { StepIndicatorItemComponent } from '../step-indicator-item/step-indicator-item.component';
import { TeleporterDestinationDirective } from '../../teleporter/destination/destination.directive';

@Component({
    selector: 'tg-step-indicator',
    templateUrl: './step-indicator.component.html',
    styleUrls: ['../step-indicator.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [ EnumHelperService ]
})
export class StepIndicatorComponent extends Collection<StepIndicatorItemComponent> implements AfterContentInit {
    @Output('change') public change$ = new EventEmitter<StepIndicatorItemComponent>();
    @ViewChild('contentDestination') public contentDestination: TeleporterDestinationDirective;

    @Input() public set compact (value: boolean) {
        this.isCompact = coerceBooleanProperty(value);
    }

    @Input() public set disableStepTitles (value: boolean) {
        this.isDisableStepTitles = coerceBooleanProperty(value);
    }

    public activeStep: StepIndicatorItemComponent;
    public classes: Array<string>;
    public isCompact: boolean = false;
    public isDisableStepTitles: boolean = false;

    public addItem (item: StepIndicatorItemComponent): void {
        super.addItem(item);
    }

    public removeItem (item: StepIndicatorItemComponent): void {
        super.removeItem(item);

        if (this.activeStep === item) {
            this.selectFirstStep();
        }
    }

    public select (itemToSelect: StepIndicatorItemComponent): void {
        if (itemToSelect.isDisabled) {
            return;
        }

        this.items.forEach(item => item.isActive = (item === itemToSelect));
        this.activeStep = itemToSelect;
        this.contentDestination.teleport(itemToSelect.contentSource);
        this.change$.emit(this.activeStep);
    }

    public ngAfterContentInit (): void {
        if (!this.activeStep) {
            this.selectFirstStep();
        }
    }

    private selectFirstStep (): void {
        let [step] = this.items;

        if (step) {
            this.select(step);
        }
    }

    private get indexOfCurrentStep (): number {
        return this.items.indexOf(this.activeStep);
    }

    public get showBackButton (): boolean {
        return this.indexOfCurrentStep > 0;
    }

    public get showForwardButton (): boolean {
        return (this.indexOfCurrentStep <= this.items.length - 2);
    }

    // navigation

    public get canMoveBack (): boolean {
        let currentIndex = this.indexOfCurrentStep;
        if (currentIndex <= 0) {
            return false;
        }

        return !(this.items[currentIndex - 1].isDisabled);
    }

    public get canMoveForward (): boolean {
        let currentIndex = this.indexOfCurrentStep;
        if (currentIndex >= this.items.length - 1) {
            return false;
        }

        return !(this.items[currentIndex + 1].isDisabled);
    }

    public moveBack (): void {
        if (!this.canMoveBack) {
            return;
        }

        let currentIndex = this.indexOfCurrentStep;
        let prevStep = this.items[currentIndex - 1];
        this.select(prevStep);
    }

    public moveForward (): void {
        if (!this.canMoveForward) {
            return;
        }

        let currentIndex = this.indexOfCurrentStep;
        let nextStep = this.items[currentIndex + 1];
        this.select(nextStep);
    }

    // display

    public get currentStepNumber () {
        return this.indexOfCurrentStep + 1;
    }

    public get totalStepNumbers () {
        return this.items.length;
    }

    public get prevStepName () {
        let currentIndex = this.indexOfCurrentStep;

        if (currentIndex <= 0) {
            return null;
        }

        return this.items[currentIndex - 1].displayName;
    }

    public get nextStepName () {
        let currentIndex = this.indexOfCurrentStep;

        if (currentIndex >= this.items.length - 1) {
            return null;
        }

        return this.items[currentIndex + 1].displayName;
    }
}
