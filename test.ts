// Angular:
import { Component, Input, ElementRef, OnChanges, OnInit, ContentChildren, QueryList, ViewChild, SimpleChanges, AfterContentInit, EventEmitter, Output, ChangeDetectorRef, OnDestroy, HostBinding, HostListener, Renderer, ViewEncapsulation  } from '@angular/core';

// Dependencies:
import { AnimateScrollService } from '../../core/services/animate-scroll.service';
import { ContentSliderItemComponent } from './content-slider-item.component';
import { ContentSliderStyleEnum } from './content-slider-style.enum';
import { DebugHelperModel } from '../../core/models/debug-helper.model';
import { DebugHelperService } from '../../core/services/debug-helper.service';
import { EnumHelperService } from '../../core/services/enum-helper.service';
import { coerceBooleanProperty } from '../forms/form-helpers';
import { Observable, Subscription } from 'rxjs';

// Constants:
const CONTENT_SLIDER_BASE_CLASS = 'o-content-slider';
const CLASSES_MAP = {
    [ContentSliderStyleEnum.compact]: `${CONTENT_SLIDER_BASE_CLASS}--compact`,
    [ContentSliderStyleEnum.wide]: `${CONTENT_SLIDER_BASE_CLASS}--wide`
};

const SCROLL_WATCH_DEBOUNCE = 15;

@Component({
    selector: 'tg-content-slider',
    templateUrl: './content-slider.component.html',
    providers: [ AnimateScrollService ],
    styleUrls: ['./content-slider.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ContentSliderComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy {

    @Input() public set showPips (value) {
        this._showPips = coerceBooleanProperty(value);
    }
    public _showPips: boolean;

    @Input() public paddingSize: ContentSliderStyleEnum;
    @Input() public selected: number;

    @Output() public selectedChange: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class') public classes: string;

    @ContentChildren(ContentSliderItemComponent) public childContentItems: QueryList<ContentSliderItemComponent>;
    @ViewChild('scrollablePane') public scrollablePane: ElementRef;
    @ViewChild('scrollWrapper') public scrollWrapper: ElementRef;

    public isDisabledLeft = true;
    public isDisabledRight: boolean;
    public sizeClass: string;

    private debugHelper: DebugHelperModel;
    private scrollSubscription: Subscription;

    constructor (
        private animateScrollService: AnimateScrollService,
        private debugHelperService: DebugHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ContentSliderComponent,
                element: elementRef
            };
        }
    }

    public ngAfterContentInit () {
        // setup item's click handlers when they are initialised
        this.childContentItems.forEach((item, idx) => {
            item.selected = this.selected === idx;
            if (item.selected) {
                item.changeDetectorRef.detectChanges();
            }
            item.setupClickHandler(this.select);
        });
        this.updateScrollControls();
    }

    public ngOnChanges (changes: SimpleChanges) {
        let { selected, style } = changes;

        if (style) {
            this.initialiseClasses();
        }

        if (selected && typeof selected.previousValue === 'number') {
            this.select(selected.currentValue);
        }
    }

    public ngOnInit () {
        this.scrollSubscription = Observable
            .fromEvent(this.scrollWrapper.nativeElement, 'scroll')
            .debounceTime(SCROLL_WATCH_DEBOUNCE)
            .subscribe(() => {
                this.updateScrollControls();
            });
        this.initialiseClasses();
    }

    public ngOnDestroy () {
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
    }

    public next (): void {
        if (this.isDisabledRight) {
            return;
        }
        let { scrollLeft, clientWidth: wrapperWidth } = this.scrollWrapper.nativeElement;

        // find right most partially visible item, scroll to there
        let rightScrollWindowEdge = scrollLeft + wrapperWidth;
        let index = 0;
        this.childContentItems.forEach((item, idx) => {
            if (item.left <= rightScrollWindowEdge &&
                item.right + item.marginLeft >= rightScrollWindowEdge) {
                index = idx;
            }
        });
        this.goTo(index);
    }

    public prev (): void {
        if (this.isDisabledLeft) {
            return;
        }
        let index = 0;
        let width = 0;
        let { scrollLeft, clientWidth: scrollWrapperWidth } = this.scrollWrapper.nativeElement;

        // find the left most partially visible item
        this.childContentItems.forEach((item, idx) => {
            if (item.left - item.marginLeft <= scrollLeft &&
                item.right >= scrollLeft) {
                index = idx;
                width = item.right - item.left;
            }
        });
        // move it to be the right most full visible position
        index = index - Math.floor(scrollWrapperWidth / width) + 1;
        index = index < 0 ? 0 : index;
        this.goTo(index);
    }

    public select = (selectedItem: ContentSliderItemComponent | number) => {
        this.childContentItems.forEach((item, idx) => {
            item.selected = selectedItem instanceof ContentSliderItemComponent ? item === selectedItem : idx === selectedItem;
            if (item.selected) {
                this.selected = idx;
            }
        });
        this.selectedChange.emit(this.selected);
        this.goTo(this.selected);
    };

    private goTo (index: number) {
        if (index < 0 || index >= this.childContentItems.length
            || !this.scrollWrapper.nativeElement || !this.scrollablePane.nativeElement) {
            return;
        }
        let scrollToItem = this.childContentItems.toArray()[index];
        if (scrollToItem.scrollToPosition != null) {
            let scrollToPosition = scrollToItem.scrollToPosition;

            // if we can see part of the last item, we only want to scroll the end of that item
            if (this.scrollablePane.nativeElement.clientWidth < scrollToPosition + this.scrollWrapper.nativeElement.clientWidth) {
                scrollToPosition = this.scrollablePane.nativeElement.clientWidth - this.scrollWrapper.nativeElement.clientWidth;
            }
            this.animateScrollService.scrollLeft(this.scrollWrapper.nativeElement, scrollToPosition);
        }
    };

    private updateScrollControls () {
        let { scrollLeft, clientWidth: wrapperWidth } = this.scrollWrapper.nativeElement;
        let { clientWidth: paneWidth } = this.scrollablePane.nativeElement;
        let scrollWrapperRight = scrollLeft + wrapperWidth;

        this.isDisabledRight = scrollWrapperRight >= paneWidth;
        this.isDisabledLeft = scrollLeft === 0 || scrollLeft === this.childContentItems.first.marginLeft;

        this.childContentItems.forEach((item) => {
             if (this.isVisible(item, scrollLeft, scrollWrapperRight)) {
                item.isVisibleInScrollWindow = true;
                item.isPartiallyVisible = false;
            } else if (this.isPartiallyVisible(item, scrollLeft, scrollWrapperRight)) {
                 item.isPartiallyVisible = true;
                 item.isVisibleInScrollWindow = false;
             } else {
                item.isVisibleInScrollWindow = false;
                item.isPartiallyVisible = false;
            }
        });
    }

    private isVisible (item, scrollLeft: any, scrollWrapperRight: any) {
        return item.left >= scrollLeft && item.right <= scrollWrapperRight;
    }

    private isPartiallyVisible (item, scrollLeft: any, scrollWrapperRight: any) {
        return (item.left - item.marginLeft <= scrollLeft && item.right >= scrollLeft)
            || (item.left <= scrollWrapperRight && item.right + item.marginLeft >= scrollWrapperRight);
    }

    private initialiseClasses () {
        let newClasses = [ CONTENT_SLIDER_BASE_CLASS ];
        if (this.paddingSize) {
            let style = this.enumHelperService.validate<typeof ContentSliderStyleEnum>(ContentSliderStyleEnum, this.paddingSize, this.debugHelper);
            newClasses.push(CLASSES_MAP[ContentSliderStyleEnum[style]]);
        }

        this.classes = newClasses.join(' ');
    }
}
