// Dependencies
import { Component, Input, OnInit, OnChanges, ElementRef, SimpleChanges, ViewChild, HostBinding, Renderer, ViewEncapsulation } from '@angular/core';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { TangramInvalidOptionError } from '../../../core/errors/tangram-invalid-option-error';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants
const BASE_CLASS = 'o-aspect-ratio';
const DEFAULT_RATIO_4X3 = '4x3';
const VALID_ASPECT_RATIOS = [ '1x1', '4x3', '16x9' ];

@Component({
    selector: 'tg-aspect-ratio',
    templateUrl: './aspect-ratio.component.html',
    styleUrls: ['./aspect-ratio.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AspectRatioComponent implements OnChanges, OnInit {
    @HostBinding('class') public classes: string;

    @Input() public imageUrl: string;

    @Input()
    public set preventPreload (value) {
        this.isPreventPreload = coerceBooleanProperty(value);
    }

    @Input()
    public set ratio (value) {
        this.aspectRatio = value || DEFAULT_RATIO_4X3;
    }

    private isPreventPreload: boolean = false;
    private aspectRatio: string = DEFAULT_RATIO_4X3;
    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: AspectRatioComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
        this.initialiseClasses();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
        this.initialiseClasses();
    }

    private initialiseClasses (): void {
        let newClasses = [ BASE_CLASS ];
        newClasses.push(`${BASE_CLASS}--${this.aspectRatio}`);

        if (this.elementRef.nativeElement && this.imageUrl && this.isPreventPreload === false) {
            this.elementRef.nativeElement.style.backgroundImage = `url(${this.imageUrl})`;
        }

        this.classes = newClasses.join(' ');
    }

    private validate (): void {
        if (VALID_ASPECT_RATIOS.indexOf(this.aspectRatio) === -1) {
            throw new TangramInvalidOptionError(`<tg-aspect-ratio> was used with an invalid 'ratio' value: ${this.ratio}`, this.debugHelper);
        }
    }
}
