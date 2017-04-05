// Dependencies:
import { Component, Directive, HostBinding, Input, ElementRef, ViewChild, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DebugHelperService } from '../../core/services/debug-helper.service';
import { DebugHelperModel } from '../../core/models/debug-helper.model';
import { coerceBooleanProperty } from '../forms/form-helpers';

// Constants:
const SCROLL_START_CLASS = 'o-scrollable-container__body--is-at-scroll-start';
const SCROLL_END_CLASS = 'o-scrollable-container__body--is-at-scroll-end';

@Component({
    selector: 'tg-scrollable-container',
    templateUrl: './scrollable-container.component.html',
    styleUrls: ['./scrollable-container.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ScrollableContainerComponent {
    @Input() public set basic (value: boolean) {
        this.isBasic = coerceBooleanProperty(value);
    }

    @Input() public set expandable (value: boolean) {
        this.isExpandable = coerceBooleanProperty(value);
    }

    @Input() public set compact (value: boolean) {
        this.isCompact = coerceBooleanProperty(value);
    }

    @ViewChild('scrollableContainerContent') public scrollableContainerContent: ElementRef;

    @HostBinding('class.o-scrollable-container') true;
    @HostBinding('class.o-scrollable-container--basic-utility') public isBasic: boolean = false;
    @HostBinding('class.o-scrollable-container--expandable') public isExpandable: boolean = false;
    @HostBinding('class.o-scrollable-container--compact') public isCompact: boolean = false;
    @HostBinding('class.o-scrollable-container--large-height') public get isLarge (): boolean {
        return !this.isCompact;
    }

    public scrollClass: string;
    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        this.scrollClass = SCROLL_START_CLASS;
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ScrollableContainerComponent,
                element: elementRef
            };
        }
    }

    public onScrollHandler (): void {
        let scrollableContent = this.scrollableContainerContent.nativeElement;

        if (!scrollableContent.scrollTop) {
            this.scrollClass = SCROLL_START_CLASS;
        } else if ((scrollableContent.scrollHeight - scrollableContent.scrollTop) === scrollableContent.offsetHeight) {
            this.scrollClass = SCROLL_END_CLASS;
        } else {
            this.scrollClass = null;
        }
    }
}

@Directive({
    selector: 'tg-scrollable-container-footer'
})
export class ScrollableContainerFooterDirective {
    @HostBinding('class.o-scrollable-container__footer') true;
}

@Directive({
    selector: 'tg-scrollable-container-header'
})
export class ScrollableContainerHeaderDirective {
    @HostBinding('class.o-scrollable-container__header') true;
}
