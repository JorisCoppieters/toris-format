// Angular:
import { Component, HostBinding, ElementRef, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AfterContentChecked } from '@angular/core';

// Dependencies
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService } from '../../../core/services';
import { Collection } from '../../../core/behaviours';
import { AccordionItemComponent } from '../accordion-item/accordion-item.component';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-accordion',
    template: '<ng-content></ng-content>',
    styleUrls: ['../accordion.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AccordionComponent extends Collection<AccordionItemComponent> implements AfterContentChecked {
    @Input() public set multi (value: boolean) {
        this.isMulti = coerceBooleanProperty(value);
    }

    @HostBinding('class.o-accordion') true;
    @HostBinding('attr.role') role = 'tabList';

    public activeItem: AccordionItemComponent;
    public isMulti: boolean = false;

    @HostBinding('attr.aria-multiselectable')
    public hasMultipleItems: boolean = false;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        super();
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: AccordionComponent,
                element: elementRef
            };
        }
    }

    // TODO ng2 - this should be ngAfterContentInit
    public ngAfterContentChecked (): void {
        this.hasMultipleItems = this.items.length > 1;
    }
}
