import { Component, ElementRef, HostBinding, HostListener, ChangeDetectorRef } from '@angular/core';
import { WindowRef } from '../../core/window-ref';

@Component({
    selector: 'tg-content-slider-item',
    template: '<ng-content></ng-content>'
})
export class ContentSliderItemComponent {
    @HostBinding('class.o-content-slider__item') true;
    @HostBinding('class.o-content-slider__item--selected') public selected: boolean = false;
    @HostBinding('attr.role') public role: string = 'listitem';

    private contentSliderSelect: Function;

    constructor (
        public changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private windowRef: WindowRef
    ) {}

    @HostListener('click', ['$event.target.value']) select (value: string) {
        this.contentSliderSelect(this);
    }

    public get scrollToPosition (): number {
        if (!this.elementRef.nativeElement) {
            return null;
        }
        return this.elementRef.nativeElement.offsetLeft - this.marginLeft;
    }

    public get left (): number {
        return this.elementRef.nativeElement.offsetLeft;
    }

    public get right (): number {
        return this.elementRef.nativeElement.offsetLeft + this.elementRef.nativeElement.clientWidth;
    }

    public get marginLeft (): number {
        return parseInt(this.windowRef.nativeWindow.getComputedStyle(this.elementRef.nativeElement).marginLeft, 10);
    }

    public setupClickHandler (clickHandler: Function): void {
        this.contentSliderSelect = clickHandler;
    }

    // public select (): void { //remove after js review of host binding changes, replaced with host listener above
    //     this.contentSliderSelect(this);
    // }

    public isPartiallyVisible: boolean;
    public isVisibleInScrollWindow: boolean;
}