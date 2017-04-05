import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'tg-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CardComponent {
    @HostBinding('class.o-card') public card = true;
    public containsSticker: boolean = false;
}
