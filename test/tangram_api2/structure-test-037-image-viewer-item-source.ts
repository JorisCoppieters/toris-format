// Angular:
import { Component, ContentChild, HostBinding, SimpleChanges } from '@angular/core';

// Dependencies:
import { AspectRatioComponent } from '../images/aspect-ratio/aspect-ratio.component';

@Component({
    selector: 'tg-image-viewer-item',
    templateUrl: './image-viewer-item.component.html'
})
export class ImageViewerItemComponent {
    @HostBinding('class') classes = 'o-image-viewer__slider__item';
    @HostBinding('attr.role') role = 'listitem';
    @ContentChild(AspectRatioComponent) public aspectRatio: AspectRatioComponent;

    public load (): void {
        if (this.aspectRatio) {
            this.aspectRatio.preventPreload = false;
            let changes: SimpleChanges = {};
            this.aspectRatio.ngOnChanges(changes); // trigger onChanges manually
        }
    }
}
