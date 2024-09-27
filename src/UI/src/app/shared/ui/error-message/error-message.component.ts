import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-error-message",
  templateUrl: "./error-message.component.html",
  styleUrl: "./error-message.component.scss",
})
export class ErrorMessageComponent {
  @Input() control: AbstractControl;

  getErrorMessages(): string[] {
    if (!this.control || !this.control.errors) {
      return [];
    }

    const errors = this.control.errors;
    const errorMessages: string[] = [];

    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName)) {
        switch (errorName) {
          case "required":
            errorMessages.push("This field is required.");
            break;
          case "minlength":
            errorMessages.push(
              `Minimum length is ${errors["minlength"].requiredLength} characters.`
            );
            break;
          case "maxlength":
            errorMessages.push(
              `Maximum length is ${errors["maxlength"].requiredLength} characters.`
            );
            break;
          case "email":
            errorMessages.push("Invalid email format.");
            break;
          // Add more cases as needed for other validation errors
          default:
            errorMessages.push("Invalid field.");
            break;
        }
      }
    }

    return errorMessages;
  }
}
