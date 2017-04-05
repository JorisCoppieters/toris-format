// Angular:
import { Component, ElementRef, Input, SimpleChanges, ViewEncapsulation, OnInit, OnChanges, HostBinding } from '@angular/core';

// Dependencies
import { DebugHelperModel } from '../../../core/models/';
import { DebugHelperService, EnumHelperService } from '../../../core/services';
import { FlagColorEnum } from './flag-color.enum';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants
const FLAG_BASE_CLASS = 'o-flag';
const FLAG_RIBBON_CLASS = `${FLAG_BASE_CLASS}--ribbon`;
const FLAG_COMPACT_CLASS = `${FLAG_BASE_CLASS}--compact`;
const FLAG_INVERTED_CLASS = `${FLAG_BASE_CLASS}--inverted`;
const COLOR_CLASSES_MAP = {
    [FlagColorEnum.paua]: `${FLAG_BASE_CLASS}--paua`,
    [FlagColorEnum.jaffa]: `${FLAG_BASE_CLASS}--jaffa`,
    [FlagColorEnum.waitomo]: `${FLAG_BASE_CLASS}--waitomo`,
    [FlagColorEnum['hokey-pokey']]: `${FLAG_BASE_CLASS}--hokey-pokey`
};

@Component({
    selector: 'tg-flag',
    template: '<ng-content></ng-content>',
    styleUrls: ['./flag.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FlagComponent implements OnInit, OnChanges {
    @HostBinding('class') public classes: string;

    @Input()
    public set compact (value: boolean) {
        this.isCompact = coerceBooleanProperty(value);
    }

    @Input()
    public set inverted (value: boolean) {
        this.isInverted = coerceBooleanProperty(value);
    }

    @Input()
    public set ribbon (value: boolean) {
        this.isRibbon = coerceBooleanProperty(value);
    }

    @Input() public color: FlagColorEnum;

    public isCompact: boolean = false;
    public isInverted: boolean = false;
    public isRibbon: boolean = false;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: FlagComponent,
                element: elementRef
            };
        }
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initializeClasses();
    }

    public ngOnInit (): void {
        this.initializeClasses();
    }

    private initializeClasses (): void {
        let newClasses = [ FLAG_BASE_CLASS ];

        if (this.isRibbon) {
            newClasses.push(FLAG_RIBBON_CLASS);
        }

        if (this.isCompact) {
            newClasses.push(FLAG_COMPACT_CLASS);
        }

        if (this.isInverted) {
            newClasses.push(FLAG_INVERTED_CLASS);
        }

        if (this.color) {
            let color = this.enumHelperService.validate<typeof FlagColorEnum>(FlagColorEnum, this.color, this.debugHelper);
            newClasses.push(COLOR_CLASSES_MAP[ color ]);
        }

        this.classes = newClasses.join(' ');
    }
}
