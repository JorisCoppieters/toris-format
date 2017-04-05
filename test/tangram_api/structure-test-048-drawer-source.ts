import { Component, trigger, transition, style, animate, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'tg-drawer',
    templateUrl: './drawer.component.html',
    animations: [
        trigger(
            'drawerAnimation',
            [
                transition(
                    'void => previous', // ---> Entering --->
                    [
                        // In order to maintain a zIndex of 2 throughout the ENTIRE
                        // animation (but not after the animation), we have to define it
                        // in both the initial and target styles. Unfortunately, this
                        // means that we ALSO have to define target values for the rest
                        // of the styles, which we wouldn't normally have to.
                        style({
                            left: -100,
                            zIndex: 2
                        }),
                        animate(
                            '200ms ease-in-out',
                            style({
                                left: 0,
                                zIndex: 2
                            })
                        )
                    ]
                ),
                transition(
                    'previous => void', // ---> Leaving --->
                    [
                        animate(
                            '200ms ease-in-out',
                            style({
                                left: 100
                            })
                        )
                    ]
                ),
                transition(
                    'void => next', // <--- Entering <---
                    [// In order to maintain a zIndex of 2 throughout the ENTIRE
                        // animation (but not after the animation), we have to define it
                        // in both the initial and target styles. Unfortunately, this
                        // means that we ALSO have to define target values for the rest
                        // of the styles, which we wouldn't normally have to.
                        style({
                            left: 100,
                            zIndex: 2
                        }),
                        animate(
                            '200ms ease-in-out',
                            style({
                                left: 0,
                                zIndex: 2
                            })
                        )]
                ),
                transition(
                    'next => void', // <--- Leaving <---
                    [animate(
                        '200ms ease-in-out',
                        style({
                            left: -100
                        })
                    )]
                )
            ]
        )]
})
export class DrawerComponent {

    public direction: string;
    public show: boolean;

    constructor (
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public update (drawers) {
        this.direction = drawers.direction;
        // We must force detection of the direction as we need it to apply before the
        // old drawer is hidden and the new one shown
        this.changeDetectorRef.detectChanges();

        this.show = drawers.activeDrawer === this;
    }
}
