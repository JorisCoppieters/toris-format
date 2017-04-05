// Angular:
import { Component, Directive, ElementRef, Input, ViewEncapsulation, HostBinding } from '@angular/core';

// Dependencies:
import { DebugHelperModel, DebugHelperService, EnumHelperService } from '../../../core';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-comment-box',
    templateUrl: './comment-box.component.html',
    styleUrls: ['./comment-box.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CommentBoxComponent {
    @Input()
    public set alternative (value: boolean) {
        this.isAlternative = coerceBooleanProperty(value);
    }

    @HostBinding('class.o-comment-box') true;
    @HostBinding('class.o-comment-box--alt') public isAlternative: boolean = false;

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: CommentBoxComponent,
                element: elementRef
            };
        }
    }
}

/* tslint:disable */

@Directive({
    selector: 'tg-comment-suffix'
})
export class CommentBoxSuffixDirective {
}


@Directive({
    selector: 'tg-comment'
})
export class CommentBoxTextDirective {
    @HostBinding('class.o-comment-box__text') true;
}

@Directive({
    selector: 'tg-comment-avatar'
})
export class CommentBoxImageDirective {
    @HostBinding('class.o-comment-box__image') true;
}