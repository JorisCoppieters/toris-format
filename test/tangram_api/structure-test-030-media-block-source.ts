// Angular:
import { Component, Directive, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-media-block',
    templateUrl: './media-block.component.html',
    styleUrls: ['./media-block.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MediaBlockComponent {
    @HostBinding('class.o-media-block') true;

    @Input()
    public set alignMiddle (value: boolean) {
        this.isAlignMiddle = coerceBooleanProperty(value);
    }

    @Input()
    public set alignRight (value: boolean) {
        this.isAlignRight = coerceBooleanProperty(value);
    }

    @HostBinding('class.o-media-block--middle')
    public isAlignMiddle: boolean = false;

    @HostBinding('class.o-media-block--right')
    public isAlignRight: boolean = false;
}

@Directive({
    selector: 'tg-media-block-content'
})
export class MediaBlockContentDirective {
    @HostBinding('class.o-media-block__content') true;
}

@Directive({
    selector: 'tg-media-block-image'
})
export class MediaBlockImageContentTag {
    @HostBinding('class.o-media-block__image') true;
}
