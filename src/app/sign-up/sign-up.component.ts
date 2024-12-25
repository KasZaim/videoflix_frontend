import {  Component, signal } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { FormGroup,FormControl, Validators,FormsModule, ReactiveFormsModule, AbstractControl,ValidationErrors  } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { merge } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HeaderComponent, 
      FooterComponent,
      MatFormFieldModule, 
      MatInputModule, 
      FormsModule, 
      ReactiveFormsModule,
      MatButtonModule,
      MatIconModule,
      CommonModule
    ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  emailFromStartPage: string = '';
  readonly email = new FormControl('', [Validators.required, Validators.email]);//email input
  errorMessage = signal('');

  signUpForm: FormGroup;
  

  hide = signal(true); //password input
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(public router : Router, private sharedService:SharedService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

      this.signUpForm = new FormGroup(
        {
          password: new FormControl('', [Validators.required, Validators.minLength(6)]),
          confirmPassword: new FormControl('', [Validators.required]),
        },
        { validators: this.passwordMatchValidator.bind(this) } // Validator richtig binden
      );
  }
  ngOnInit() {
    this.sharedService.currentValue.subscribe((newValue) => {
      this.emailFromStartPage = newValue; // Eingabefeld aktualisieren
    });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  // Überprüfen, ob die Passwörter nicht übereinstimmen
  get passwordMismatchError(): boolean {
    return this.signUpForm.hasError('passwordMismatch') && this.signUpForm.touched;
  }
  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form submitted successfully:', this.signUpForm.value);
      this.router.navigate(['/welcome']);
    } else {
      console.log('Form is invalid');
    }
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
}
