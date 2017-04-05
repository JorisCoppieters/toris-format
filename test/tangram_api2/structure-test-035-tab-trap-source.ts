// Dependencies:
import { Component, Input, AfterContentChecked, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '../../forms/form-helpers';

// Constants:
const TABBABLE_ELEMENTS = 'input, button, select, textarea, a[href], *[tabindex]';

@Component({
    selector: 'tg-tab-trap',
    templateUrl: './tab-trap.component.html',
    styleUrls: ['./tab-trap.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TabTrapComponent implements AfterContentChecked {
    @Input()
    public set focusFirst (value: boolean) {
        this.isFocusFirst = coerceBooleanProperty(value);
    }

    public isFocusFirst: boolean = false;

    @ViewChild('focusLeaderElement') public focusLeaderElement: ElementRef;
    @ViewChild('contentElement') public contentElement: ElementRef;
    @ViewChild('focusTrailerElement') public focusTrailerElement: ElementRef;

    private previouslyFocused: EventTarget;

    constructor (
        private elementRef: ElementRef
    ) { }

    public ngAfterContentChecked (): void {
        [
            this.focusLeaderElement,
            this.contentElement,
            this.focusTrailerElement
        ].forEach(element => element.nativeElement.addEventListener('focus', this.onElementFocus));

        if (this.isFocusFirst && !!this.elementRef.nativeElement.children) {
            this.focusLeaderElement.nativeElement.focus();
        }
    }

    private onElementFocus = (evt: Event): void => {
        let target: EventTarget = evt.target;
        let potentiallyTabbableChildren: any = this.contentElement.nativeElement.querySelectorAll(TABBABLE_ELEMENTS);
        let tabbables = <Array<HTMLElement>>Array.from(potentiallyTabbableChildren).filter((element: HTMLElement) => {
            return element.tabIndex >= 0;
        });

        if (tabbables[0]) {
            let element = tabbables[0];
            if (this.previouslyFocused === this.focusLeaderElement.nativeElement && target === this.focusLeaderElement.nativeElement) {
                element = tabbables[tabbables.length - 1];
            }
            this.previouslyFocused = target;
            element.focus();
        }
    }
}
