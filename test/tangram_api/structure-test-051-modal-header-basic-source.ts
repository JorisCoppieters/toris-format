import { Component, Input, Output, EventEmitter, HostBinding, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '../../../../forms/form-helpers';
import { TangramStyleClass } from '../../../../../core/abstract-classes/tangram-style.class';

@Component({
    selector: 'tg-modal-header-basic',
    templateUrl: 'modal-header-basic.component.html',
    styleUrls: ['../modal-header-rack/modal-header-rack.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ModalHeaderBasicComponent extends TangramStyleClass {
    @Input() public title: string;

    @Input() public set compact (value) {
        this.isCompact = coerceBooleanProperty(value);
    }
    @HostBinding('class.o-modal__header__rack--compact') public isCompact: boolean;

    @Input() public showClose: boolean;

    @Output('closeClick') public closeClick$: EventEmitter<void> = new EventEmitter<void>();

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

    public close (): void {
        this.closeClick$.emit();
    }
}
