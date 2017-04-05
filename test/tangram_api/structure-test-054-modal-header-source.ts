import { Component, HostBinding } from '@angular/core';
import { ModalComponent } from '../modal.component';

@Component({
    selector: 'tg-modal-header',
    templateUrl: './modal-header.component.html'
})
export class ModalHeaderComponent {
    @HostBinding('class.o-modal__header') true;

    @HostBinding('attr.id') public get ariaDescribedbyId (): string {
        return this.tgModal.ariaDescribedbyId;
    }

    constructor (
        public tgModal: ModalComponent
    ) {}
}
