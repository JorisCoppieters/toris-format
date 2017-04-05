import { Component, Input, ElementRef, SimpleChanges, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';

import { TangramInvalidOptionError } from '../../../core/errors/tangram-invalid-option-error';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';

@Component({
    selector: 'tg-thumbnail-gallery',
    templateUrl: './thumbnail-gallery.component.html',
    styleUrls: ['./thumbnail-gallery.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ThumbnailGalleryComponent implements OnInit, OnChanges {
    @Input() ratio: string;
    @Input() xsCols: number;
    @Input() sdCols: number;
    @Input() mdCols: number;
    @Input() lgCols: number;
    @Input() xlCols: number;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ThumbnailGalleryComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit () : void {
        this.validate();
        this.initialiseRatio();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initialiseRatio();
    }

    private initialiseRatio (): void {
        this.ratio = this.ratio || '4x3';
    }

    private validate (): void {
        if (!this.nullOrValid(this.xsCols, 2)) {
            throw new TangramInvalidOptionError(`<tg-thumbnail-gallery> was called with an invalid "tg-xs-cols" value: ${this.xsCols}`, this.debugHelper);
        }

        if (!this.nullOrValid(this.sdCols, 2, 3)) {
            throw new TangramInvalidOptionError(`<tg-thumbnail-gallery> was called with an invalid "tg-sd-cols" value: ${this.sdCols}`, this.debugHelper);
        }

        if (!this.nullOrValid(this.mdCols, 2, 3, 4)) {
            throw new TangramInvalidOptionError(`<tg-thumbnail-gallery> was called with an invalid "tg-md-cols" value: ${this.mdCols}`, this.debugHelper);
        }

        if (!this.nullOrValid(this.lgCols, 2, 3, 4, 6)) {
            throw new TangramInvalidOptionError(`<tg-thumbnail-gallery> was called with an invalid "tg-lg-cols" value: ${this.lgCols}`, this.debugHelper);
        }

        if (!this.nullOrValid(this.xlCols, 2, 3, 4, 6)) {
            throw new TangramInvalidOptionError(`<tg-thumbnail-gallery> was called with an invalid "tg-xl-cols" value: ${this.xlCols}`, this.debugHelper);
        }
    }

    private nullOrValid (value, ...validOptions): boolean {
        if (typeof value === 'undefined') {
            return true;
        }

        if (typeof value === null) {
            return true;
        }

        // Can't use .find, so use filter.
        return validOptions.filter((v) => v === value).length > 0;
    }

    public get classes (): string {
        let c = ['o-thumbnail-gallery'];

        if (this.xsCols) {
            c.push(`o-thumbnail-gallery--xs-${this.xsCols}-col`);
        }

        if (this.sdCols) {
            c.push(`o-thumbnail-gallery--sd-${this.sdCols}-col`);
        }

        if (this.mdCols) {
            c.push(`o-thumbnail-gallery--md-${this.mdCols}-col`);
        }

        if (this.lgCols) {
            c.push(`o-thumbnail-gallery--lg-${this.lgCols}-col`);
        }

        if (this.xlCols) {
            c.push(`o-thumbnail-gallery--xl-${this.xlCols}-col`);
        }

        return c.join(' ');
    }
}
