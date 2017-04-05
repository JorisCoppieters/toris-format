// Angular:
import { Component, Input, OnInit, ContentChildren, QueryList, AfterContentInit, OnChanges, SimpleChanges, HostBinding, Directive, ViewEncapsulation } from '@angular/core';

// Dependencies:
import { DrawerComponent } from './drawer.component';
import { DrawersDirectionEnum } from './drawers-direction.enum';

@Component({
    selector: 'tg-drawers',
    template: '<ng-content></ng-content>',
    styleUrls: ['./drawers.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class DrawersComponent implements AfterContentInit, OnInit, OnChanges {

    @Input() public selected: number;

    @HostBinding('class.o-infinite-drawers') true;

    @ContentChildren(DrawerComponent) public childDrawers: QueryList<DrawerComponent>;

    public activeDrawer: DrawerComponent;
    private previousActiveIndex: number;

    public get direction (): string {
        if (this.previousActiveIndex === null) {
            return null;
        }
        let direction = this.previousActiveIndex < this.selected ? DrawersDirectionEnum.next : DrawersDirectionEnum.previous;
        return DrawersDirectionEnum[direction];
    }

    public ngOnInit (): void {
        this.selected = +this.selected || 0;
    }

    public ngOnChanges (changes: SimpleChanges): void {
        let { selected } = changes;
        if (this.childDrawers && selected) {
            this.previousActiveIndex = selected.previousValue;
            this.setChildStates();
        }
    }

    public ngAfterContentInit (): void {
        if (this.childDrawers) {
            this.setChildStates();
        }
    }

    private setChildStates (): void {
        this.activeDrawer = this.childDrawers.toArray()[this.selected];
        this.childDrawers.forEach(drawer => drawer.update(this));
    }
}
