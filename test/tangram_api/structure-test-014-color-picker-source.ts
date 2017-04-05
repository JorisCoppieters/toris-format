// Angular:
import { Component, Input, OnChanges, OnInit, EventEmitter, Output, SimpleChanges, ViewEncapsulation, HostBinding } from '@angular/core';

// Dependencies:
import { ColorPickerColorEnum } from './color-picker-color.enum';
import { EnumHelperService } from '../../../core/services/enum-helper.service';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'ul[tgColorPicker]',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.css' ],
    encapsulation: ViewEncapsulation.None
})
export class ColorPickerComponent implements OnInit, OnChanges {
    @HostBinding('class.o-color-picker') true;
    @HostBinding('class.o-color-picker--grid') public isGrid: boolean = false;

    // [colors]
    @Input() public colors: Array<string>;

    // [size]
    @Input() public size: string;

    // [grid]
    @Input()
    public set grid (value) {
        this.isGrid = coerceBooleanProperty(value);
    }

    // [(selection)]
    private selectionValue: Array<string> = [];
    @Output() selectionChange = new EventEmitter<Array<string>>();

    @Input()
    get selection(): Array<string> {
        return this.selectionValue;
    }

    set selection(val: Array<string>) {
        this.selectionValue = val;
        this.selectionChange.emit(this.selectionValue);
    }

    private colorValues = [];

    constructor (
        private tgEnumHelper: EnumHelperService) {
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseColours();
    }

    public ngOnInit (): void {
        this.initialiseColours();
    }

    public updateSelection (): void {
        let newSelection = [];

        this.colorValues.forEach((value, idx) => {
            if (value) {
                newSelection.push(this.colors[ idx ]);
            }
        });

        this.selection = newSelection;
    }

    private initialiseColours (): void {
        let newColorValues = [];
        this.colors = this.colors || this.tgEnumHelper.parseEnumStringsToArray(ColorPickerColorEnum);

        this.colors.forEach((color) => {
            if (this.selection.indexOf(color) > -1) {
                newColorValues.push(true);
            } else {
                newColorValues.push(false);
            }
        });

        this.colorValues = newColorValues;
    }
}
