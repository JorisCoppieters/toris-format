// Angular:
import { AfterContentChecked, HostListener, HostBinding, OnChanges, OnInit, Renderer, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

// Dependencies:
import { TangramIconEnum, TangramStyleEnum } from '../../../core/enums';
import { DebugHelperModel } from '../../../core/models';
import { DebugHelperService, DomHelperService, EnumHelperService } from '../../../core/services';
import { TangramStyleClass } from '../../../core/abstract-classes/tangram-style.class';

// Constants:
const N_LINES_BEFORE_STACK: number = 4;
const STACK_AT_MOBILE_CLASS: string = 'o-box-info--stack-sm-only';
const PRIMARY_CLASS = 'o-box-info--primary';

@Component({
    selector: 'tg-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['info-box.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class InfoBoxComponent extends TangramStyleClass implements AfterContentChecked, OnChanges, OnInit {
    @HostBinding('class.o-box-info') true;

    @Input() public icon: TangramIconEnum;
    @ViewChild('infoBox') public infoBox: ElementRef;
    @ViewChild('infoBoxContent') public infoBoxContent: ElementRef;

    protected tangramStyleClassPrimary = PRIMARY_CLASS;

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
                component: InfoBoxComponent,
                element: elementRef
            };
        }

        // todo ng2:
        // Move this to mediaSizeService:
        // this.checkShouldStack = this.domHelperService.addResizeHandler(this.checkShouldStack);
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.validate();
    }

    public ngOnInit (): void {
        this.validate();
    }

    public ngAfterContentChecked (): void {
        this.checkShouldStack();
    }

    @HostListener('window:resize')
    public checkShouldStack (): void {
        if (this.icon && this.infoBoxContent) {
            let infoBox = this.elementRef.nativeElement;
            let infoBoxContent = this.infoBoxContent.nativeElement;

            if (infoBox && infoBoxContent) {
                this.renderer.setElementClass(infoBox, STACK_AT_MOBILE_CLASS, false);

                let { lineHeight, paddingTop, paddingBottom } = window.getComputedStyle(infoBoxContent);
                let padding = this.domHelperService.styleToNumber(paddingTop) + this.domHelperService.styleToNumber(paddingBottom);
                let height = infoBoxContent.clientHeight - padding;

                let shouldStack = (height / this.domHelperService.styleToNumber(lineHeight)) >= N_LINES_BEFORE_STACK;
                if (shouldStack) {
                    this.renderer.setElementClass(infoBox, STACK_AT_MOBILE_CLASS, true);
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
