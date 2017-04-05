// Angular:
import {
    Component, HostBinding, EventEmitter, Input, Output, OnDestroy, ContentChildren,
    QueryList, ElementRef, ViewChild, AfterContentInit, OnChanges, SimpleChanges, OnInit, ViewEncapsulation
} from '@angular/core';

// Dependencies:
import { DebugHelperModel } from '../../core/models/debug-helper.model';
import { DebugHelperService } from '../../core/services/debug-helper.service';
import { IconSizeEnum } from '../icons/icon/icon-size.enum';
import { ImageViewerItemComponent } from './image-viewer-item.component';
import { interval } from 'rxjs/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { TangramInvalidOptionError } from '../../core/errors/tangram-invalid-option-error';
import { MediaSizeService } from '../../core/services/media-size.service';
import { MediaSizeMap } from '../../core/services/media-size.service';
import { coerceBooleanProperty } from '../forms/form-helpers';

// Constants:
const DEFAULT_AUTO_ROTATE_SPEED = 5;
const IMAGE_VIEWER_CLASS = 'o-image-viewer';
const IMAGE_VIEWER_HAS_SINGLE_IMAGE_CLASS = 'o-image-viewer--has-single-image';
const INVERTED_CLASS = 'o-image-viewer--inverted-buttons';
const SMALL_BUTTONS_CLASS = 'o-image-viewer--small-buttons';

@Component({
    selector: 'tg-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        MediaSizeService
    ]
})
export class ImageViewerComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {
    @HostBinding('class') public classes: string;

    @Input() public set autoRotate (value: boolean) {
        this.isAutoRotate = coerceBooleanProperty(value);
    }

    @Input() public set invertButtonColor (value: boolean) {
        this.isInvertButtonColor = coerceBooleanProperty(value);
    }

    @Input() public set smallButtons (value: boolean) {
        this.isSmallButtons = coerceBooleanProperty(value);
    }

    @Input() public autoRotateSpeed: number;
    @Input() public selected: number;
    @Output() public selectedChange: EventEmitter<any> = new EventEmitter();

    @ContentChildren(ImageViewerItemComponent) public imageViewerItems: QueryList<ImageViewerItemComponent>;
    @ViewChild('sliderWrapper') public sliderWrapperRef: ElementRef;

    public iconSize: string;
    public isAutoRotate: boolean = false;
    public isInvertButtonColor: boolean = false;
    public isSmallButtons: boolean = false;

    private selectedChild: ImageViewerItemComponent;
    private debugHelper: DebugHelperModel;
    private interval: Subscription;

    constructor (
        private debugHelperService: DebugHelperService,
        private elementRef: ElementRef,
        private mediaSizeService: MediaSizeService
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ImageViewerComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.mediaSizeService.mediaSizeChange$
            .subscribe((mediaSizeMap: MediaSizeMap) => {
                this.iconSize = mediaSizeMap.isXLarge ? IconSizeEnum[IconSizeEnum.medium] : null;
            });
    }

    public get hasMultipleImages (): boolean {
        return (this.imageViewerItems && this.imageViewerItems.length > 1);
    }

    public ngAfterContentInit (): void {
        this.validate();
        this.initialiseClasses();
        this.goToImageAtIndex(this.selected || 0);

        if (this.isAutoRotate) {
            this.startAutoRotation();
        }
    }

    public ngOnDestroy () {
        this.cancelAutoRotation();
    }

    public ngOnChanges (changes: SimpleChanges) {
        let { selected } = changes;
        // skip first
        if (selected && typeof selected.previousValue === 'number') {
            this.goToImageAtIndex(selected.currentValue);
        }
    }

    public goToNextImage (): void {
        this.restartAutoRotation();
        this.goToImageAtIndex(this.nextIndex);
    }

    public goToPreviousImage (): void {
        this.restartAutoRotation();
        this.goToImageAtIndex(this.previousIndex);
    }

    private goToImageAtIndex (index: number): void {
        this.selectedChange.emit(index);

        this.selected = index;
        this.sliderWrapperRef.nativeElement.size.transform = `translate3d(-${this.selected * 100}%, 0, 0)`;

        this.preFetchImageAtIndex(this.previousIndex);
        this.preFetchImageAtIndex(this.selected);
        this.preFetchImageAtIndex(this.nextIndex);
    }

    private preFetchImageAtIndex (index: number): void {
        this.selectedChild = this.imageViewerItems.toArray()[index];
        this.selectedChild.load();
    }

    private get nextIndex (): number {
        return this.selected === this.imageViewerItems.length - 1 ? 0 : this.selected + 1;
    }

    private get previousIndex (): number {
        return this.selected === 0 ? this.imageViewerItems.length - 1 : this.selected - 1;
    }

    private cancelAutoRotation (): void {
        if (this.interval) {
            this.interval.unsubscribe();
        }
    }

    private initialiseClasses (): void {
        let newClasses = [ IMAGE_VIEWER_CLASS ];

        if (!this.hasMultipleImages) {
            newClasses.push(IMAGE_VIEWER_HAS_SINGLE_IMAGE_CLASS);
        }

        if (this.isInvertButtonColor) {
            newClasses.push(INVERTED_CLASS);
        }

        if (this.isSmallButtons) {
            newClasses.push(SMALL_BUTTONS_CLASS);
        }

        this.classes = newClasses.join(' ');
    }

    private startAutoRotation (): void {
        this.interval = interval((this.autoRotateSpeed || DEFAULT_AUTO_ROTATE_SPEED) * 1000)
            .subscribe(() => this.goToImageAtIndex(this.nextIndex));
    }

    private restartAutoRotation (): void {
        this.cancelAutoRotation();

        if (this.autoRotate) {
            this.startAutoRotation();
        }
    }

    private validate (): void {
        if (!this.imageViewerItems || !this.imageViewerItems.length) {
            throw new TangramInvalidOptionError('imageViewerItems must have at least one element', this.debugHelper);
        }
    }
}
