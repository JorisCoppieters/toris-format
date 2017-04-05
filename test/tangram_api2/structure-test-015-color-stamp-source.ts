// Angular:
import { Component, Input, ElementRef, SimpleChanges, ViewEncapsulation, HostBinding } from '@angular/core';
import { OnChanges, OnInit } from '@angular/core';

// Dependencies:
import { ColorStampColorEnum } from './color-stamp-color.enum';
import { ColorStampSizeEnum } from './color-stamp-size.enum';
import { TangramMissingValueError } from '../../../core/errors';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, EnumHelperService } from '../../../core/services';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants:
const BASE_CLASS = 'o-color-stamp';
const COLOR_CLASSES_MAP = {
    [ColorStampColorEnum.beige]: 'o-color-stamp--beige',
    [ColorStampColorEnum.black]: 'o-color-stamp--black',
    [ColorStampColorEnum.blue]: 'o-color-stamp--blue',
    [ColorStampColorEnum.brown]: 'o-color-stamp--brown',
    [ColorStampColorEnum.cream]: 'o-color-stamp--cream',
    [ColorStampColorEnum.gold]: 'o-color-stamp--gold',
    [ColorStampColorEnum.green]: 'o-color-stamp--green',
    [ColorStampColorEnum.grey]: 'o-color-stamp--grey',
    [ColorStampColorEnum.orange]: 'o-color-stamp--orange',
    [ColorStampColorEnum.pink]: 'o-color-stamp--pink',
    [ColorStampColorEnum.purple]: 'o-color-stamp--purple',
    [ColorStampColorEnum.red]: 'o-color-stamp--red',
    [ColorStampColorEnum.silver]: 'o-color-stamp--silver',
    [ColorStampColorEnum.white]: 'o-color-stamp--white',
    [ColorStampColorEnum.yellow]: 'o-color-stamp--yellow',

    // Tangram supports multiple values for multicolour
    [ColorStampColorEnum.multi]: 'o-color-stamp--multi-color',
    [ColorStampColorEnum['multi-color']]: 'o-color-stamp--multi-color',
    [ColorStampColorEnum['multi-colored']]: 'o-color-stamp--multi-color',
    [ColorStampColorEnum['multi-colour']]: 'o-color-stamp--multi-color',
    [ColorStampColorEnum['multi-coloured']]: 'o-color-stamp--multi-color'
};
const SIZE_CLASSES_MAP = {
    [ColorStampSizeEnum.compact]: 'o-color-stamp--compact',
    [ColorStampSizeEnum.large]: 'o-color-stamp--large'
};

@Component({
    selector: 'tg-color-stamp',
    template: '<ng-content></ng-content>',
    styleUrls: ['./color-stamp.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ColorStampComponent implements OnInit, OnChanges {
    @HostBinding('class') public classes: string;

    @Input() public color: ColorStampColorEnum;
    @Input() public size: ColorStampSizeEnum;
    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ColorStampComponent,
                element: elementRef
            };
        }
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initialiseClasses();
    }

    public ngOnInit (): void {
        this.validate();
        this.initialiseClasses();
    }

    public initialiseClasses (): void {
        let newClasses = [ BASE_CLASS ];

        let color = this.enumHelperService.validate<typeof ColorStampColorEnum>(ColorStampColorEnum, this.color, this.debugHelper);
        newClasses.push(COLOR_CLASSES_MAP[ color ]);

        if (this.size) {
            let size: string = this.enumHelperService.validate<typeof ColorStampSizeEnum>(ColorStampSizeEnum, this.size, this.debugHelper);
            newClasses.push(SIZE_CLASSES_MAP[ size ]);
        }

        this.classes = newClasses.join(' ');
    }

    private validate (): void {
        if (!this.color) {
            throw new TangramMissingValueError(this.color, 'color', this.debugHelper);
        }
    }
}
