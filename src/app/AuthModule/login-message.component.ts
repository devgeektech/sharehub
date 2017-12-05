import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from './login-validation.service';

@Component({
  selector: 'control-messages',
  template: `<div style="color:#FF5A5F" class="loginmessage" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ControlMessages {
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    
    return null;
  }
}