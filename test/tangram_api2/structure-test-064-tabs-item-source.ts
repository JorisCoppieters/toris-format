// Angular:
import { Component, Directive, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { OnChanges, OnDestroy, OnInit } from '@angular/core';

// Dependencies:
import { TabsComponent } from '../tabs/tabs.component';
import { TeleporterSourceDirective } from '../../teleporter/source/source.directive';
import { coerceBooleanProperty } from '../../forms/form-helpers';

@Component({
    selector: 'tg-tab',
    templateUrl: 'tabs-item.component.html'
})
export class TabsItemComponent implements OnChanges, OnDestroy, OnInit {
    @Input() public set active (value) {
        this.isActive = coerceBooleanProperty(value);
    }

    @ViewChild('source') public source: TeleporterSourceDirective;

    public isActive: boolean = false;

    constructor (
        private tabs: TabsComponent
    ) {
    }

    public ngOnInit (): void {
        this.tabs.addItem(this);
        this.initialiseState();
    }

    public ngOnChanges (changes: SimpleChanges): void {
        this.initialiseState();
    }

    public ngOnDestroy (): void {
        this.tabs.removeItem(this);
    }

    public select (): void {
        this.tabs.select(this);
    }

    private initialiseState (): void {
        if (this.isActive) {
            this.select();
        }
    }
}

// Define content tags:
@Directive({
    /* tslint:disable: directive-selector-name directive-selector-type */
    selector: 'tg-tab-heading, tg-tab-content'
    /* tslint:enable: directive-selector-name directive-selector-type */
})
export class TabsItemContentTags { }
