// Angular:
import {
    Directive, Input, Component, Output, EventEmitter, OnChanges, OnInit, ElementRef,
    SimpleChanges, Renderer, OnDestroy, ViewEncapsulation, HostBinding
} from '@angular/core';

// Dependencies:
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DropdownBoxPositionEnum } from './dropdown-box-position.enum';
import { EnumHelperService } from '../../../core/services/enum-helper.service';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants:
const ACTIVE_CLASS = 'o-dropdown-box--is-active';
const BASE_CLASS = 'o-dropdown-box';
const COMPACT_CLASS = 'o-dropdown-box--compact';
const STYLE_CLASSES_MAP = {
    [DropdownBoxPositionEnum.above]: 'o-dropdown-box--above',
    [DropdownBoxPositionEnum.right]: 'o-dropdown-box--right'
};

@Component({
    selector: 'tg-dropdown-box',
    templateUrl: './dropdown-box.component.html',
    styleUrls: ['./dropdown-box.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DropdownBoxComponent implements OnInit, OnChanges, OnDestroy {
    @HostBinding('class') public classes: string = '';

    @Input() public position: DropdownBoxPositionEnum;

    @Input() public set closeOnClick (value: boolean) {
        this.isCloseOnClick = coerceBooleanProperty(value);
    }

    @Input() public set compact (value: boolean) {
        this.isCompact = coerceBooleanProperty(value);
    }

    @Input() public set isActive (newValue: boolean) {
        this.isActiveValue = newValue;
        this.isActiveChange.emit(this.isActiveValue);
        this.initialiseClasses();
    }
    public get isActive (): boolean {
        return this.isActiveValue;
    }

    @Output() public isActiveChange = new EventEmitter<boolean>();

    public isCloseOnClick: boolean = false;
    public isCompact: boolean = false;
    private debugHelper: DebugHelperModel;
    private destroyBodyClickListener: Function;
    private isActiveValue: boolean;

    constructor (
        private debugHelperService: DebugHelperService,
        private elementRef: ElementRef,
        private enumHelperService: EnumHelperService,
        private renderer: Renderer
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: DropdownBoxComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
        this.initialiseClasses();
        this.createListeners();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseClasses();
    }

    public ngOnDestroy (): void {
        if (this.destroyBodyClickListener) {
            this.destroyBodyClickListener();
        }
    }

    private createListeners (): void {
        this.destroyBodyClickListener = this.renderer.listenGlobal('body', 'click', this.handleClick);
    }

    private handleClick = (event: Event) => {
        if (this.elementRef.nativeElement === event.target || this.elementRef.nativeElement.contains(<HTMLElement>event.target)) {
            if (this.isCloseOnClick) {
                this.isActive = false;
            }
        } else {
            this.isActive = false;
        }
    };

    private initialiseClasses (): void {
        let newClasses = [BASE_CLASS];

        if (this.position) {
            let position = this.enumHelperService.validate<typeof DropdownBoxPositionEnum>(DropdownBoxPositionEnum, this.position, this.debugHelper);
            newClasses.push(STYLE_CLASSES_MAP[position]);
        }

        if (this.isActive) {
            newClasses.push(ACTIVE_CLASS);
        }

        if (this.isCompact) {
            newClasses.push(COMPACT_CLASS);
        }

        this.classes = newClasses.join(' ');
    }

    public toggleActive (event: MouseEvent): void {
        if (event.button !== 1) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.isActive = !this.isActive;
    }

    private validate (): void {
        if (this.position) {
            this.enumHelperService.validate<typeof DropdownBoxPositionEnum>(DropdownBoxPositionEnum, this.position, this.debugHelper);
        }
    }
}

// Define content tags:
@Directive({
    /* tslint:disable: directive-selector-name directive-selector-type */
    selector: 'tg-dropdown-box-trigger-content, tg-dropdown-box-pane'
    /* tslint:enable: directive-selector-name directive-selector-type */
})
export class DropdownBoxContentTags {}
