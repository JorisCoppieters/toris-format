// Angular:
import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ol[tgBreadcrumbs]',
    template: '<ng-content></ng-content>',
    styleUrls: ['../breadcrumbs.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbsComponent {
    @HostBinding('class.o-breadcrumbs') true;
}
