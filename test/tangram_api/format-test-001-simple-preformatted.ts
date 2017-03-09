@Component({
    selector: 'tg-swagman',
    templateUrl: './swagman.component.html',
    providers: [TG_SWAGMAN_CONTROL_VALUE_ACCESSOR],
    styleUrls: ['./swagman.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SwitchComponent implements ControlValueAccessor, OnInit, OnChanges {
    @HostBinding('class.o-swagman') public isApplied: boolean = true;
    @ViewChild('input') public inputElement: ElementRef;
    // [name]
    @Input('name') public swagmanId: string;
    // [disabled]
    public isDisabled: boolean = false;
    @Input() public get disabled (): boolean {
        return this.isDisabled;
    }
    public set disabled (value) {
        this.isDisabled = coerceBooleanProperty(value);
        this.inputElement.nativeElement.disabled = value;
    }
    // (change)
    @Output('change') public change$: EventEmitter<SwitchChange> = new EventEmitter<SwitchChange>();
    // [(selected)]
    public selectedValue: boolean = false;
    @Output() public selectedChange = new EventEmitter<boolean>();
    @Input()
    public get selected() {
        return this.selectedValue;
    }
    public set selected(val) {
        this.selectedValue = val;
        this.selectedChange.emit(this.counterValue);
    }
    constructor (
        public form: NgForm,
        elementRef: ElementRef
    ) {
    }
}