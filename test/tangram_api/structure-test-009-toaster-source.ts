import { AfterContentChecked, OnChanges, OnInit, Renderer, SimpleChanges, AfterContentInit, HostListener, ViewEncapsulation } from '@angular/core';
import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';

// Dependencies:
import { TangramIconEnum, TangramStyleEnum } from '../../../core/enums';
import { DebugHelperService, DomHelperService, EnumHelperService } from '../../../core/services';
import { DebugHelperModel } from '../../../core/models';
import { TangramStyleClass } from '../../../core/abstract-classes/tangram-style.class';

// Constants:
const N_LINES_BEFORE_STACK: number = 2;
const STACK_AT_MOBILE_CLASS = 'o-box-toaster--stack-sm-only';

@Component({
    selector: 'tg-toaster',
    templateUrl: './toaster.component.html',
    styleUrls: ['toaster.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ToasterComponent extends TangramStyleClass implements AfterContentInit, OnChanges, OnInit {
    @HostBinding('class.o-box-toaster') true;
    @ViewChild('toasterContent') public toasterContent: ElementRef;
    @Input() public icon: TangramIconEnum;

    protected tangramStyleClassDanger: string = 'o-box-toaster--danger';
    protected tangramStyleClassPrimary: string = 'o-box-toaster--primary';
    protected tangramStyleClassSuccess: string = 'o-box-toaster--success';
    protected tangramStyleClassWarning: string = 'o-box-toaster--warning';

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService,
        private enumHelperService: EnumHelperService,
        elementRef: ElementRef,
        renderer: Renderer
    ) {
        super(elementRef, renderer);

        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ToasterComponent,
                element: elementRef
            };
        }
    }

    public ngAfterContentInit (): void {
        this.checkShouldStack();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
    }

    public ngOnInit (): void {
        this.validate();
    }

    @HostListener('window:resize')
    public checkShouldStack (): void {
        if (this.icon && this.toasterContent) {
            let toaster = this.elementRef.nativeElement;
            let toasterContent = this.toasterContent.nativeElement;

            if (toaster && toasterContent) {
                this.renderer.setElementClass(toaster, STACK_AT_MOBILE_CLASS, false);

                let { paddingTop, paddingBottom, lineHeight } = window.getComputedStyle(toasterContent);
                let padding = this.domHelperService.styleToNumber(paddingTop) + this.domHelperService.styleToNumber(paddingBottom);
                let height = toasterContent.clientHeight - padding;
                let shouldStack = (height / this.domHelperService.styleToNumber(lineHeight)) > N_LINES_BEFORE_STACK;

                if (shouldStack) {
                    this.renderer.setElementClass(toaster, STACK_AT_MOBILE_CLASS, true);
                }
            }
        }
    }

    private validate (): void {
        if (this.icon) {
            this.enumHelperService.validate<typeof TangramIconEnum>(TangramIconEnum, this.icon, this.debugHelper);
        }
    }
}
