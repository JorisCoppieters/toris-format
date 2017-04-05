// Dependencies:
import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'tg-sticker-multi-item',
    template: '<ng-content></ng-content>'
})
export class StickerMultiItemComponent {
    @HostBinding('class.o-sticker-positioner__item') true;
}