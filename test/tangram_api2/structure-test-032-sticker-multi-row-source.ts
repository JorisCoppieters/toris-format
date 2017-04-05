// Dependencies:
import { Component, ElementRef, OnInit, HostBinding } from '@angular/core';

// Dependencies:
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, EnumHelperService } from '../../../core/services';
import { StickerComponent } from './sticker.component';
import { StickerPositionEnum } from './sticker-position.enum';

@Component({
    selector: 'tg-sticker-multi-row',
    template: '<ng-content></ng-content>'
})
export class StickerMultiRowComponent implements OnInit {
    @HostBinding('class.o-sticker-positioner__row') true;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        private tgSticker: StickerComponent,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: StickerMultiRowComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
    }

    private validate (): void {
        this.enumHelperService.validate<typeof StickerPositionEnum>(StickerPositionEnum, this.tgSticker.position, this.debugHelper);
    }
}
