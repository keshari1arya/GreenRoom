import {
  Directive,
  ElementRef,
  HostBinding,
  Optional,
  Renderer2,
  Self,
} from "@angular/core";
import {
  FormControlName,
  AbstractControl,
  NgControlStatus,
  NgControl,
} from "@angular/forms";

@Directive({
  selector: "[controlValidationClass]",
  standalone: false,
})
export class ControlValidationClassDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() @Self() private controlName: FormControlName
  ) {}

  ngOnInit() {
    if (this.controlName && this.controlName.control) {
      const control = this.controlName.control;

      control.valueChanges.subscribe(() => {
        this.updateClass(control);
      });

      control.registerOnChange(() => {
        this.updateClass(control);
      });

      // Initial class update
      // this.updateClass(control);
    }
  }

  private updateClass(control: AbstractControl) {
    if ((control.touched || control.dirty) && control.invalid) {
      this.renderer.addClass(this.el.nativeElement, "is-invalid");
      this.renderer.removeClass(this.el.nativeElement, "is-valid");
    } else if ((control.touched || control.dirty) && control.valid) {
      this.renderer.addClass(this.el.nativeElement, "is-valid");
      this.renderer.removeClass(this.el.nativeElement, "is-invalid");
    } else {
      this.renderer.removeClass(this.el.nativeElement, "is-invalid");
      this.renderer.removeClass(this.el.nativeElement, "is-valid");
    }
  }
}
