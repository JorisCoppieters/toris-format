import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService } from '../../../core/services';
import { TangramMissingValueError } from '../../../core/errors';
import { TabTrapComponent } from '../../helpers/tab-trap/tab-trap.component';

@Component({
    selector: 'tg-overlay',
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class OverlayComponent implements OnChanges, OnInit {li
    @Input() public show: boolean;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: OverlayComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit (): void {
        this.validate();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.ngOnInit();
    }

    public stopPropagation (event: Event): void {
        event.stopPropagation();
    }

    private validate (): void {
        if (this.show == null) {
            throw new TangramMissingValueError(this.show, 'show', this.debugHelper);
        }
    }
}
