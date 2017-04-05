// Angular:
import { ElementRef, Input, SimpleChanges, Directive, HostBinding, Component, ViewEncapsulation } from '@angular/core';
import { OnChanges, OnInit } from '@angular/core';

// Dependencies:
import { TangramMissingValueError } from '../../../core/errors';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService } from '../../../core/services';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-expanding-image',
    template: '<ng-content></ng-content>',
    styleUrls: ['./expanding-image.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ExpandingImageComponent implements OnChanges, OnInit {
    @HostBinding('class.o-expanding-image') true;
    @HostBinding('class.o-expanding-image--cover') public isCover = false;

    @Input() public imageUrl: string;

    @Input() public set cover (value) {
        this.isCover = coerceBooleanProperty(value);
    }

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ExpandingImageComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
        this.initialiseState();
    }

    public ngOnChanges (change: SimpleChanges): void {
        this.validate();
        this.initialiseState();
    }

    private initialiseState (): void {
        this.elementRef.nativeElement.style.backgroundImage = `url(${this.imageUrl})`;

    }

    private validate (): void {
        if (!this.imageUrl) {
            throw new TangramMissingValueError(this.imageUrl, 'imageUrl', this.debugHelper);
        }
    }
}
