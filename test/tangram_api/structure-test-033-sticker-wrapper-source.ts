// Angular:
import { Component, Input, ElementRef, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { OnChanges, OnInit, HostBinding } from '@angular/core';

// Dependencies:
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, EnumHelperService } from '../../../core/services';
import { StickerSizeEnum } from './sticker-size.enum';

// Constants:
const BASE_CLASS = 'o-sticker-positioner';
const SIZE_CLASSES_MAP = {
    [StickerSizeEnum.medium]: 'o-sticker-positioner--medium',
    [StickerSizeEnum.thumbnail]: 'o-sticker-positioner--thumbnail'
};

@Component({
    selector: 'tg-sticker-wrapper',
    template: '<ng-content></ng-content>',
    styleUrls: ['sticker-positioner.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class StickerWrapperComponent implements OnChanges, OnInit {
    @HostBinding('class') public classes: string;
    @Input() public size: StickerSizeEnum;
    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: StickerWrapperComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.initialiseClasses();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseClasses();
    }

    private initialiseClasses (): void {
        let newClasses = [ BASE_CLASS ];

        if (this.size) {
            let size = this.enumHelperService.validate<typeof StickerSizeEnum>(StickerSizeEnum, this.size, this.debugHelper);
            newClasses.push(SIZE_CLASSES_MAP[size]);
        }

        this.classes = newClasses.join(' ');
    }
}
