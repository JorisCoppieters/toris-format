import { Component, Input, HostBinding, Renderer, ElementRef, ViewEncapsulation } from '@angular/core';
import { TangramStyleClass } from '../../../../../core/abstract-classes/tangram-style.class';

@Component({
    selector: 'tg-modal-header-rack',
    templateUrl: 'modal-header-rack.component.html',
    styleUrls: ['./modal-header-rack.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ModalHeaderRackComponent extends TangramStyleClass {
    @Input() public title: string;

    @HostBinding('class.o-modal__header__rack--compact') @Input('compact') public isCompact: boolean;
    @HostBinding('class.o-modal__header__rack') true;

    protected tangramStyleClassPrimary: string = 'o-modal__header__rack--primary';
    protected tangramStyleClassSuccess: string = 'o-modal__header__rack--success';
    protected tangramStyleClassWarning: string = 'o-modal__header__rack--warning';
    protected tangramStyleClassDanger: string = 'o-modal__header__rack--danger';

    constructor (
        elementRef: ElementRef,
        renderer: Renderer
    ) {
        super(elementRef, renderer);
    }
}
