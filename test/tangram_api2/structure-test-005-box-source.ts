// Angular:
import { Component, ElementRef, Input, HostBinding, Renderer, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { DebugHelperModel, DebugHelperService } from '../../../core';
import { TangramStyleClass } from '../../../core/abstract-classes/tangram-style.class';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-box',
    template: '<ng-content></ng-content>',
    styleUrls: ['./box.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BoxComponent extends TangramStyleClass {
    @HostBinding('class.o-box') true;
    @HostBinding('class.o-box--compact') public isCompact: boolean = false;
    @HostBinding('class.o-box--simple') public isSimple: boolean = false;
    @HostBinding('class.o-box--highlight') public isHighlight: boolean = false;
    @HostBinding('class.o-box--solid') public isSolid: boolean = false;
    @HostBinding('class.o-box--solid-extender') public isSolidExtended: boolean = false;
    @HostBinding('class.o-box--dashed') public isDashed: boolean = false;

    @Input()
    public set simple (value: boolean) {
        this.isSimple = coerceBooleanProperty(value);
    }

    @Input()
    public set highlight (value: boolean) {
        this.isHighlight = coerceBooleanProperty(value);
    }

    @Input()
    public set solid (value: boolean) {
        this.isSolid = coerceBooleanProperty(value);
    }

    @Input()
    public set solidExtended (value: boolean) {
        this.isSolidExtended = coerceBooleanProperty(value);
    }

    @Input()
    public set dashed (value: boolean) {
        this.isDashed = coerceBooleanProperty(value);
    }

    @Input()
    public set compact (value: boolean) {
        this.isCompact = coerceBooleanProperty(value);
    }

    protected tangramStyleClassDanger: string = 'o-box--highlight-danger';
    protected tangramStyleClassPrimary: string = 'o-box--highlight-primary';
    protected tangramStyleClassSuccess: string = 'o-box--highlight-success';
    protected tangramStyleClassWarning: string = 'o-box--highlight-warning';

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        elementRef: ElementRef,
        renderer: Renderer
    ) {
        super(elementRef, renderer);

        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: BoxComponent,
                element: elementRef
            };
        }
    }
}
