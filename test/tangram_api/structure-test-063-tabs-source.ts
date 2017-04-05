// Angular:
import { Component, Input, Output, ViewChild, EventEmitter, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AfterContentInit, OnChanges, OnInit } from '@angular/core';

// Dependencies:
import { Collection } from '../../../core/behaviours';
import { TabsItemComponent } from '../tabs-item/tabs-item.component';
import { TeleporterDestinationDirective } from '../../teleporter/destination/destination.directive';

// Constants:
// todo ng2 ?
// const NO_CONTENT_CLASS: string = 'o-tabs--no-content';

@Component({
    selector: 'tg-tabs',
    templateUrl: 'tabs.component.html',
    styleUrls: ['../tabs.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TabsComponent extends Collection<TabsItemComponent> implements AfterContentInit {
    @ViewChild('destination') public destination: TeleporterDestinationDirective;
    @Output('change') public change$ = new EventEmitter<TabsItemComponent>();

    public activeTab: TabsItemComponent;
    public classes: Array<string>;

    public addItem (item: TabsItemComponent): void {
        super.addItem(item);
    }

    public removeItem (item: TabsItemComponent): void {
        if (this.activeTab === item) {
            this.selectFirstTab();
        }

        super.removeItem(item);
    }

    public select (itemToSelect: TabsItemComponent): void {
        this.items.forEach(item => item.isActive = (item === itemToSelect));
        this.activeTab = itemToSelect;
        this.destination.teleport(itemToSelect.source);
        this.change$.emit(this.activeTab);
    }

    public ngAfterContentInit (): void {
        if (!this.activeTab) {
            this.selectFirstTab();
        }
    }

    private selectFirstTab (): void {
        let [ tab ] = this.items;

        if (tab) {
            this.select(tab);
        }
    }
}
