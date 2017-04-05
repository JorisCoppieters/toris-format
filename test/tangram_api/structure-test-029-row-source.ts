// Angular:
import { Component, ElementRef, HostBinding, Input, SimpleChanges } from '@angular/core';
import { OnChanges, OnInit } from '@angular/core';

// Dependencies:
import { TangramFlexAlignEnum, TangramFlexJustifyEnum } from '../../../core/enums';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, EnumHelperService } from '../../../core/services';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants:
const ROW_CLASS: string = 'l-row';
const ALIGN_CLASS: string = `${ROW_CLASS}--align-`;
const ALIGN_CLASSES_MAP = {
    [TangramFlexAlignEnum.baseline]: `${ALIGN_CLASS}baseline`,
    [TangramFlexAlignEnum.center]: `${ALIGN_CLASS}center`,
    [TangramFlexAlignEnum.end]: `${ALIGN_CLASS}end`,
    [TangramFlexAlignEnum.start]: `${ALIGN_CLASS}start`
};
const FLEX_CONTENTS_CLASS: string = `${ROW_CLASS}--has-flex-contents`;
const FLEX_FIT_COLS_CLASS: string = `${ROW_CLASS}--fit-cols`;
const FLEX_FULL_COLS_CLASS: string = `${ROW_CLASS}--full-cols`;
const JUSTIFY_CLASS: string = `${ROW_CLASS}--justify-`;
const JUSTIFY_CLASSES_MAP = {
    [TangramFlexJustifyEnum.center]: `${JUSTIFY_CLASS}center`,
    [TangramFlexJustifyEnum.end]: `${JUSTIFY_CLASS}end`,
    [TangramFlexJustifyEnum.start]: `${JUSTIFY_CLASS}start`
};

@Component({
    selector: 'tg-row',
    template: '<ng-content></ng-content>'
})
export class RowComponent implements OnChanges, OnInit {
    @HostBinding('class') public classes: string;

    @Input() public align: TangramFlexAlignEnum;
    @Input() public justify: TangramFlexJustifyEnum;

    @Input() public set fitCols(value: boolean) {
        this.isFitCols = coerceBooleanProperty(value);
    }

    @Input() public set flexContents(value: boolean) {
        this.isFlexContents = coerceBooleanProperty(value);
    }

    @Input() public set fullCols(value: boolean) {
        this.isFullCols = coerceBooleanProperty(value);
    }

    public isFitCols: boolean = false;
    public isFlexContents: boolean = false;
    public isFullCols: boolean = false;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: RowComponent,
                element: elementRef
            };
        }
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseClasses();
    }

    public ngOnInit (): void {
        this.initialiseClasses();
    }

    private initialiseClasses = () => {
        let classes = [ROW_CLASS];

        if (this.align) {
            let align = this.enumHelperService.validate<typeof TangramFlexAlignEnum>(TangramFlexAlignEnum, this.align, this.debugHelper);
            classes.push(ALIGN_CLASSES_MAP[align]);
        }

        if (this.justify) {
            let justify = this.enumHelperService.validate<typeof TangramFlexJustifyEnum>(TangramFlexJustifyEnum, this.justify, this.debugHelper);
            classes.push(JUSTIFY_CLASSES_MAP[justify]);
        }

        if (this.isFlexContents) {
            classes.push(FLEX_CONTENTS_CLASS);
        }

        if (this.isFitCols) {
            classes.push(FLEX_FIT_COLS_CLASS);
        }

        if (this.isFullCols) {
            classes.push(FLEX_FULL_COLS_CLASS);
        }

        // We join the classes as a string as they are passed directly
        // to @HostBinding():
        this.classes = classes.join(' ');
    };
}
