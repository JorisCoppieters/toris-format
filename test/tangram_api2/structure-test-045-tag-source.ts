// Angular:
import { Component, HostBinding, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { OnChanges, OnInit } from '@angular/core';

// Dependencies:
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, EnumHelperService } from '../../../core/services';
import { TagColorEnum } from './tag-color.enum';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants:
const TAG_BASE_CLASS = 'o-tag';
const TAG_CLOSABLE_CLASS = 'o-tag--closable';
const STYLE_CLASSES_MAP = {
    [TagColorEnum.paua]: 'o-tag--paua',
    [TagColorEnum.jaffa]: 'o-tag--jaffa',
    [TagColorEnum.waitomo]: 'o-tag--waitomo',
    [TagColorEnum['hokey-pokey']]: 'o-tag--hokey-pokey'
};

@Component({
    selector: 'tg-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TagComponent implements OnChanges, OnInit {
    @HostBinding('class') public classes: string;

    @Input() public color: string;

    @Input()
    public set removable (value: boolean) {
        this.isRemovable = coerceBooleanProperty(value);
    }

    @Output('remove') public remove$ = new EventEmitter<any>();

    public isRemovable: boolean = false;
    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private elementRef: ElementRef,
        private enumHelperService: EnumHelperService
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: TagComponent,
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

    public remove (): void {
        this.elementRef.nativeElement.remove();
        this.remove$.emit(this);
    }

    private initialiseClasses (): void {
        let newClasses = [ TAG_BASE_CLASS ];

        if (this.isRemovable) {
            newClasses.push(TAG_CLOSABLE_CLASS);
        }

        if (this.color) {
            let color = this.enumHelperService.validate<typeof TagColorEnum>(TagColorEnum, this.color, this.debugHelper);
            newClasses.push(STYLE_CLASSES_MAP[color]);
        }

        this.classes = newClasses.join(' ');
    }
}
