import { Component, Input, SimpleChanges, Output, OnInit, OnChanges, EventEmitter, ElementRef, HostBinding } from '@angular/core';
import { DomHelperService } from '../../../core/services/dom-helper.service';
import { TangramInvalidOptionError } from '../../../core/errors/tangram-invalid-option-error';
import { DebugHelperService } from '../../../core/services/debug-helper.service';
import { DebugHelperModel } from '../../../core/models/debug-helper.model';

const ALLOWED_MIME_TYPES = ['image/bmp', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png'];

@Component({
    selector: 'tg-thumbnail-uploader',
    templateUrl: 'thumbnail-uploader.component.html'
})
export class ThumbnailUploaderComponent implements OnInit, OnChanges {
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() ratio: string;

    public allowedMimeTypes: Array<string> = ALLOWED_MIME_TYPES;
    public id: string;

    @HostBinding('class.o-thumbnail-gallery__upload-button') true;
    @HostBinding('attr.role') role = 'listitem';

    private debugHelper: DebugHelperModel;

    constructor (
        private debugHelperService: DebugHelperService,
        private domHelperService: DomHelperService,
        private elementRef: ElementRef
    ) {
        if (this.debugHelperService.isEnabled) {
            this.debugHelper = {
                component: ThumbnailUploaderComponent,
                element: elementRef
            };
        }
    }

    public ngOnInit () : void {
        this.initialiseState();
        this.validate();
    }

    public ngOnChanges (changes: SimpleChanges) : void {
        this.initialiseState();
        this.validate();
    }

    public onFileChanged (files: any){
        this.onChange.emit({'files': files});
    }

    private validate () : void {
        if( this.onChange.observers.length == 0 ) {
            throw new TangramInvalidOptionError(`A <tg-thumbnail-uploader> must have a "OnChange" attribute.`, this.debugHelper);
        }
    }

    private initialiseState (): void {
        this.id = this.domHelperService.makeId();
    }
}
