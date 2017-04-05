import { Component, Input, Output, EventEmitter, HostBinding, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { TangramIconEnum } from '../../../../../core/enums/tangram-icon.enum';
import { ModalComponent } from '../../modal.component';
import { TangramStyleClass } from '../../../../../core/abstract-classes/tangram-style.class';

@Component({
    selector: 'tg-modal-header-hero',
    templateUrl: './modal-header-hero.component.html',
    styleUrls: ['./modal-header-hero.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ModalHeaderHeroComponent extends TangramStyleClass {
    @Input() public title: string;
    @Input() public icon: TangramIconEnum;
    @Input() public showClose: boolean;
    @Output('closeClick') public closeClick$: EventEmitter<void> = new EventEmitter<void>();

    @HostBinding('class.o-modal__header__hero') true;

    protected tangramStyleClassPrimary: string = 'o-modal__header__hero--primary';
    protected tangramStyleClassSuccess: string = 'o-modal__header__hero--success';
    protected tangramStyleClassWarning: string = 'o-modal__header__hero--warning';
    protected tangramStyleClassDanger: string = 'o-modal__header__hero--danger';

    public classes = [];

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
