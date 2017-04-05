import { Component, ElementRef, Input, SimpleChanges, HostBinding } from '@angular/core';
import { OnChanges, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/core';

import { AccordionComponent } from '../accordion/accordion.component';
import { TangramInvalidOptionError } from '../../../core/errors';
import { TangramIconEnum } from '../../../core/enums/';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, DomHelperService, EnumHelperService } from '../../../core/services';
import { coerceBooleanProperty } from '../../forms/form-helpers';

import { ANIMATION_TIME } from '../../../core';

@Component({
    animations: [
        trigger('expand', [
            state('true', style({ height: '*', overflow: 'visible' })),
            state('false', style({ height: 0, overflow: 'hidden' })),
            transition('1 <=> 0', animate(ANIMATION_TIME))
        ])
    ],
    selector: 'tg-accordion-item',
    templateUrl: './accordion-item.component.html'
})
export class AccordionItemComponent implements OnChanges, OnDestroy, OnInit {
    @Input() public leftIcon: TangramIconEnum;
    @Input() public title: string;

    @Input() public set expanded (value: boolean) {
        this.isExpanded = coerceBooleanProperty(value);
    }

    @HostBinding('class.o-accordion__item') true;
    @HostBinding('class.s-is-active') public isExpanded: boolean = false;

    public contentId: string;
    public titleId: string;

    private debugHelper: DebugHelperModel;

    constructor (
        private accordionComponent: AccordionComponent,
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: AccordionItemComponent,
                element: elementRef
            };
        }
    }

    public contract (): void {
        this.isExpanded = false;
    }

    public expand (): void {
        this.isExpanded = true;
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
    }

    public ngOnDestroy (): void {
        this.accordionComponent.removeItem(this);
    }

    public ngOnInit (): void {
        this.accordionComponent.addItem(this);
        this.validate();
        this.initialiseState();
    }

    public toggleExpanded ($event: Event): void {
        if (this.accordionComponent.isMulti === false) {
            let { activeItem } = this.accordionComponent;
            if (activeItem && activeItem !== this) {
                activeItem.contract();
            }
            this.accordionComponent.activeItem = this;
        }

        // TODO ng2 one way bugs up in here
        if (this.isExpanded) {
            this.contract();
        } else {
            this.expand();
        }
    }

    private initialiseState (): void {
        this.titleId = this.domHelperService.makeId();
        this.contentId = `${this.titleId}-content`;

        if (this.isExpanded && this.accordionComponent.isMulti === false) {
            this.accordionComponent.activeItem = this;
        }
    }

    private validate (): void {
        if (this.leftIcon) {
            this.enumHelperService.validate<typeof TangramIconEnum>(TangramIconEnum, this.leftIcon, this.debugHelper);
        }

        if (this.isExpanded && this.accordionComponent.isMulti === false && this.accordionComponent.activeItem) {
            throw new TangramInvalidOptionError(`Only one <tg-accordion-item> can have 'expanded' attribute when the <tg-accordion> does not have 'multi' attribute`, this.debugHelper);
        }
    }
}
