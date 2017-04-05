// Angular:
import { Component, ElementRef, Input, EventEmitter, Output, ViewEncapsulation, AfterViewInit, OnDestroy, HostBinding, HostListener } from '@angular/core';

// Dependencies:
import { TangramYoureGonnaHaveABadTimeError } from '../../../core/errors';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, DomHelperService } from '../../../core/services';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-sticky-box',
    template: '<ng-content></ng-content>',
    styleUrls: ['./sticky-box.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class StickyBoxComponent implements AfterViewInit, OnDestroy {
    @HostBinding('class.o-sticky-box') true;
    @HostBinding('class.s-is-active') public isActive: boolean = false;

    @Output() activeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() public set active (value: boolean) {
        this.isActive = coerceBooleanProperty(value);
    }

    private previousBodyPaddingTop: number;
    private stickyOriginalOffsetTop: number;
    private debugHelperModel: DebugHelperModel;

    constructor (
        private domHelperService: DomHelperService,
        private elementRef: ElementRef,
        debugHelperService: DebugHelperService
    ) {
        if (debugHelperService.isEnabled) {
            this.debugHelperModel = {
                component: StickyBoxComponent,
                element: elementRef
            };
        }
    }

    public ngAfterViewInit (): void {
        if (this.isActive) {
            this.enableSticky();
        }
    }

    public ngOnDestroy (): void {
        this.setBodyPadding(0);
    }

    @HostListener('window:scroll')
    public onScroll (): void {
        let contentOffsetTop = this.elementRef.nativeElement.offsetTop;
        let bodyScrollTop = document.body.scrollTop;

        if (this.isActive === false && bodyScrollTop > contentOffsetTop) {
            this.enableSticky();
        } else if (this.isActive === true && bodyScrollTop < this.stickyOriginalOffsetTop) {
            this.disableSticky();
        }
    }

    private enableSticky () {
        this.setBodyPadding(this.elementRef.nativeElement.offsetHeight);
        this.stickyOriginalOffsetTop = this.elementRef.nativeElement.getBoundingClientRect().top;
        this.isActive = true;
        this.activeChange.emit(true);
    }

    private disableSticky () {
        this.setBodyPadding(this.previousBodyPaddingTop);
        this.isActive = false;
        this.activeChange.emit(false);
    }

    private setBodyPadding (height: number): void {
        try {
            this.previousBodyPaddingTop = this.domHelperService.styleToNumber(document.body.style.paddingTop);
            document.body.style.paddingTop = `${height}px`;
        } catch (e) {
            throw new TangramYoureGonnaHaveABadTimeError('Looks like you might be trying to change the styles on <body> without a real DOM...');
        }
    }
}
