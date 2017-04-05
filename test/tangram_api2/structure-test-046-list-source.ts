import { Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { coerceBooleanProperty } from '../../../forms/form-helpers';
import { DebugHelperModel } from '../../../../core/models';
import { DebugHelperService, EnumHelperService } from '../../../../core/services';
import { ListTypeEnum } from './list-type.enum';
import { TangramAlignEnum } from '../../../../core/enums';
import { TangramInvalidOptionError } from '../../../../core/errors';

// Constants:
const ALIGN_CLASS = 'o-list--text-align-';
const COMPACT_CLASS = 'm--compact';
const FLOAT_CLASS = 'o-list-float';
const FLOAT_RIGHT_CLASS = 'o-list-float o-list-float--right';
const STYLE_CLASSES_MAP = {
    [ListTypeEnum.bullet]: 'o-list-bullet',
    [ListTypeEnum.flat]: 'o-list-flat',
    [ListTypeEnum.ruled]: 'o-list-ruled',
    [ListTypeEnum.ordered]: 'o-list-ordered',
    [ListTypeEnum.orderedAlpha]: 'o-list-ordered o-list-ordered--alpha',
    [ListTypeEnum.icon]: 'o-list-icon',
    [ListTypeEnum.piped]: 'o-list-piped'
};

@Component({
    selector: 'ul[tgList], ol[tgList]',
    template: '<ng-content></ng-content>',
    styleUrls: ['./list.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ListComponent implements OnChanges, OnInit {
    @Input() public set compact (value: boolean) {
        this.isCompact = coerceBooleanProperty(value);
    }

    @Input() public set float (value: boolean) {
        this.isFloat = coerceBooleanProperty(value);
    }

    @Input() public set floatRight (value: boolean) {
        this.isFloatRight = coerceBooleanProperty(value);
    }

    @Input() public align: TangramAlignEnum;
    @Input() public size: number; // todo ng2 @craig refactor: make enum
    @Input() public type: ListTypeEnum;

    public isCompact: boolean = false;
    public isFloat: boolean = false;
    public isFloatRight: boolean = false;

    @HostBinding('class') public appliedClasses: string = '';

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ListComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
        this.initialiseClasses();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initialiseClasses();
    }

    private initialiseClasses (): void {
        let newClasses = [];

        if (this.type) {
            let type = this.enumHelperService.validate<typeof ListTypeEnum>(ListTypeEnum, this.type, this.debugHelper);
            newClasses.push(STYLE_CLASSES_MAP[type]);
        }
        if (this.isCompact) {
            newClasses.push(COMPACT_CLASS);
        }
        if (this.align) {
            newClasses.push(`${ALIGN_CLASS}${this.align}`);
        }
        if (this.isFloat) {
            newClasses.push(FLOAT_CLASS);
        }
        if (this.isFloatRight) {
            newClasses.push(FLOAT_CLASS);
            newClasses.push(FLOAT_RIGHT_CLASS);
        }

        this.appliedClasses = newClasses.join(' ');
    }

    private validate (): void {
        if (this.align) {
            this.enumHelperService.validate<typeof TangramAlignEnum>(TangramAlignEnum, this.align, this.debugHelper);
        }

        if (this.type) {
            let type = this.enumHelperService.validate<typeof ListTypeEnum>(ListTypeEnum, this.type, this.debugHelper);

            if (type === ListTypeEnum.piped && (this.isFloat || this.isFloatRight)) {
                if (this.isFloat) {
                    throw new TangramInvalidOptionError(`'float' cannot be applied with type 'piped'.`, this.debugHelper);
                }
                if (this.isFloatRight) {
                    throw new TangramInvalidOptionError(`'floatRight' cannot be applied with type 'piped'.`, this.debugHelper);
                }
            }
        }
    }
}
