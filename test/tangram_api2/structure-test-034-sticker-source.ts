// Dependencies:
import { Component, Input, ElementRef, SimpleChanges } from '@angular/core';
import { OnChanges, OnInit, Optional } from '@angular/core';

// Dependencies:
import { DebugHelperModel } from '../../../core/models';
import { EnumHelperService, DebugHelperService } from '../../../core/services';
import { StickerPositionEnum } from './sticker-position.enum';
import { CardComponent } from '../../card/card.component';

// Constants:
const BASE_CLASS = 'o-sticker-positioner__container';
const STICKER_BASE_CLASS = 'o-sticker-positioner__container--';
const POSITION_CLASSES_MAP = {
    [StickerPositionEnum['top-left']]: `${STICKER_BASE_CLASS}top-left`,
    [StickerPositionEnum['top-right']]: `${STICKER_BASE_CLASS}top-right`,
    [StickerPositionEnum['bottom-left']]: `${STICKER_BASE_CLASS}bottom-left`,
    [StickerPositionEnum['bottom-right']]: `${STICKER_BASE_CLASS}bottom-right`
};

@Component({
    selector: 'tg-sticker',
    template: '<ng-content></ng-content>'
})
export class StickerComponent implements OnChanges, OnInit {
    @Input() public position: StickerPositionEnum;

    @Input('class') public classes: string;

    private debugHelper: DebugHelperModel;

    constructor (
        @Optional() private tgCard: CardComponent,
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: StickerComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.initialiseState();
        this.initialiseClasses();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseState();
        this.initialiseClasses();
    }

    public initialiseClasses (): void {
        let newClasses = [ BASE_CLASS ];

        if (this.position) {
            let position = this.enumHelperService.validate<typeof StickerPositionEnum>(StickerPositionEnum, this.position, this.debugHelper);
            newClasses.push(POSITION_CLASSES_MAP[position]);
        }

        this.classes = newClasses.join(' ');
    }

    private initialiseState (): void {
        if (this.tgCard) {
            this.tgCard.containsSticker = true;
        }
    }
}
