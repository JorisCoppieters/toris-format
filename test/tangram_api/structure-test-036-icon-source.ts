// Angular:
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, HostBinding, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { IconSizeEnum } from './icon-size.enum';
import { TangramIconEnum, TangramStyleEnum } from '../../../core/enums';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, DomHelperService, EnumHelperService, TangramConfigService } from '../../../core/services';
import { TangramMissingValueError } from '../../../core/errors';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants:
const SIZE_CLASSES_MAP = {
    [IconSizeEnum.small]: 'icon--small',
    [IconSizeEnum.medium]: 'icon--size-32',
    [IconSizeEnum.large]: 'icon--size-48',
    [IconSizeEnum.xlarge]: 'icon--size-64'
};
const STYLE_CLASSES_MAP = {
    [TangramStyleEnum.danger]: 'icon--danger',
    [TangramStyleEnum.primary]: '',
    [TangramStyleEnum.success]: 'icon--success',
    [TangramStyleEnum.warning]: 'icon--warning'
};

@Component({
    selector: 'tg-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class IconComponent implements OnChanges, OnInit {
    @Input() public alt: string;
    @Input() public name: TangramIconEnum;
    @Input() public size: IconSizeEnum;

    @Input() public set danger (value) { this._danger = coerceBooleanProperty(value); }
    @Input() public set success (value) { this._success = coerceBooleanProperty(value); }
    @Input() public set warning (value) { this._warning = coerceBooleanProperty(value); }

    @HostBinding('class.icon--danger') public _danger: boolean;
    @HostBinding('class.icon--success') public _success: boolean;
    @HostBinding('class.icon--warning') public _warning: boolean;

    public ariaLabelledBy: string;
    public classes: Array<string>;
    public href: string;
    public titleId: string;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService,
        private enumHelperService: EnumHelperService,
        private tangramConfigService: TangramConfigService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: IconComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
        this.initialiseState();
        this.initialiseClasses();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initialiseState();
        this.initialiseClasses();
    }

    private initialiseClasses (): void {
        this.classes = [];

        if (this.size) {
            let size = this.enumHelperService.validate<typeof IconSizeEnum>(
                IconSizeEnum, this.size, this.debugHelper);
            this.classes.push(SIZE_CLASSES_MAP[size]);
        }
    }

    private initialiseState () {
        if (this.alt) {
            this.titleId = this.domHelperService.makeId(`icon${this.name}${this.alt}`);
            this.ariaLabelledBy = this.titleId;
        }
        this.href = `${this.tangramConfigService.iconPath}#${this.name}`;
    }

    private validate () {
        if (!this.name) {
            throw new TangramMissingValueError(this.name, 'name', this.debugHelper);
        }

        this.enumHelperService.validate<typeof TangramIconEnum>(TangramIconEnum, this.name, this.debugHelper);
    }
}
