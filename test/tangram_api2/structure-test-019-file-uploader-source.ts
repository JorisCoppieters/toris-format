// Dependencies:
import { Component, HostBinding, OnInit, ElementRef, Output, Input, Renderer, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DomHelperService } from '../../../../core/services/dom-helper.service';

@Component({
    selector: 'tg-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploaderComponent implements OnInit {
    @HostBinding('class.o-file-uploader') true;

    @Input() public acceptedMimeTypes: Array<string>;
    @Input() public multiple: boolean = true;
    @Output() public onChange: EventEmitter<any> = new EventEmitter();
    @Output() public onDragLeave: EventEmitter<any> = new EventEmitter();
    @Output() public onDragOver: EventEmitter<any> = new EventEmitter();

    public _acceptedMimeTypes: string;
    public _multiple: boolean;
    public id: string;

    constructor (
        private elementRef: ElementRef,
        private renderer: Renderer,
        private tgDomHelpers: DomHelperService
    ) {}

    public ngOnInit () {
        this.renderer.listen(this.elementRef.nativeElement, 'dragover', ($event: Event) => this.dragOverHandler($event));
        this.renderer.listen(this.elementRef.nativeElement, 'dragleave', ($event: Event) => this.dragLeaveHandler($event));
        this.renderer.listen(this.elementRef.nativeElement, 'drop', ($event: Event) => this.fileHandler($event));

        this.id = this.tgDomHelpers.makeId();
        this._acceptedMimeTypes = this.acceptedMimeTypes.join();
        this._multiple = this.multiple ;
    }

    public fileHandler ($event: Event) {
        let $target = (<any>$event).dataTransfer || $event.currentTarget;
        let files = Array.from<File>($target.files);
        this.onChange.emit({ files: files });
        this.dragLeaveHandler($event);
    }

    public dragOverHandler ($event) {
        $event.stopPropagation();
        $event.preventDefault();
        this.onDragOver.emit($event);
    }

    public dragLeaveHandler ($event) {
        $event.stopPropagation();
        $event.preventDefault();
        this.onDragLeave.emit($event);
    }
}