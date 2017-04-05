import { Component, HostBinding, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-thumbnail-image',
    templateUrl: './thumbnail-image.component.html'
})
export class ThumbnailImageComponent implements OnInit, OnChanges {
    @HostBinding('class.o-thumbnail-gallery__item') true;
    @HostBinding('class.o-thumbnail-gallery__item--selected') public isSelected: boolean = false;

    @Input() public ratio: string;
    @Input() public src: string;

    @Input() public set selected (value: boolean) {
        this.isSelected = coerceBooleanProperty(value);
    }

    public ngOnInit () : void {
        this.initialiseRatio();
    }

    public ngOnChanges (changes: SimpleChanges) : void {
        this.initialiseRatio();
    }

    private initialiseRatio (): void {
        this.ratio =  this.ratio = this.ratio || '4x3';
    }
}
