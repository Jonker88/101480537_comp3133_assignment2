import { Directive, ElementRef, HostListener, inject, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

/** Trims leading/trailing whitespace on blur for template-driven or reactive controls. */
@Directive({
  selector: '[appTrimBlur]',
  standalone: true,
})
export class TrimBlurDirective {
  private readonly el = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  private readonly control = inject(NgControl, { optional: true });

  @HostListener('blur')
  onBlur(): void {
    const raw = this.el.nativeElement.value;
    if (typeof raw !== 'string') return;
    const trimmed = raw.trim();
    if (this.control?.control) {
      this.control.control.setValue(trimmed, { emitEvent: true });
    } else {
      this.el.nativeElement.value = trimmed;
    }
  }
}
