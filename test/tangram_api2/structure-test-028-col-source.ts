// Angular:
import { Component, HostBinding, Input, SimpleChanges } from '@angular/core';
import { OnChanges, OnInit } from '@angular/core';

// Constants:
const FLEX_CONTENTS_CLASS: string = 'l-col--has-flex-contents';
const COL_CLASS: string = 'l-col';
const COL_CLASSES_MAP = createColClassesMap();

@Component({
    selector: 'tg-col',
    template: '<ng-content></ng-content>'
})
export class ColComponent implements OnChanges, OnInit {
    @Input() public flexContents: boolean;
    @Input() public sm: number;
    @Input() public smPull: number;
    @Input() public smPush: number;
    @Input() public smOffset: number;
    @Input() public sd: number;
    @Input() public sdPull: number;
    @Input() public sdPush: number;
    @Input() public sdOffset: number;
    @Input() public md: number;
    @Input() public mdPull: number;
    @Input() public mdPush: number;
    @Input() public mdOffset: number;
    @Input() public mg: number;
    @Input() public mgPull: number;
    @Input() public mgPush: number;
    @Input() public mgOffset: number;
    @Input() public lg: number;
    @Input() public lgPull: number;
    @Input() public lgPush: number;
    @Input() public lgOffset: number;
    @Input() public ll: number;
    @Input() public llPull: number;
    @Input() public llPush: number;
    @Input() public llOffset: number;
    @Input() public xl: number;
    @Input() public xlPull: number;
    @Input() public xlPush: number;
    @Input() public xlOffset: number;

    @HostBinding('class') public classes: string;

    public ngOnInit (): void {
        this.initialiseClasses();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseClasses();
    }

    private initialiseClasses (): void {
        let classes = [COL_CLASS];

        if (this.flexContents) {
            classes.push(FLEX_CONTENTS_CLASS);
        }

        Object.keys(this)
        .forEach(key => {
            let value = this[key];
            if (this[key] != null && COL_CLASSES_MAP[key] != null) {
                classes.push(`${COL_CLASSES_MAP[key]}${value}`);
            }
        });

        // We join the classes as a string as they are passed directly
        // to @HostBinding():
        this.classes = classes.join(' ');
    };
}

function createColClassesMap (): { [key: string]: string } {
    const SIZES: Array<string> = ['sm', 'sd', 'md', 'mg', 'lg', 'll', 'xl'];
    const SUFFIXES: Array<string> = ['Pull', 'Push', 'Offset'];

    let classesMap = {};
    SIZES.forEach(size => {
        let lowerCaseSize = size.toLowerCase();
        classesMap[`${size}`] = `${COL_CLASS}--${lowerCaseSize}-`;
        SUFFIXES.forEach(suffix => {
            let lowerCaseSuffix = suffix.toLowerCase();
            classesMap[`${size}${suffix}`] = `${COL_CLASS}--${lowerCaseSize}-${lowerCaseSuffix}-`;
        });
    });
    return classesMap;
}
