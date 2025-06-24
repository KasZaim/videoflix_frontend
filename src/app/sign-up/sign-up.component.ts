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
import { Router, RouterModule } from '@angular/router';
import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment'

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
      CommonModule,
      RouterModule
    ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  emailFromStartPage: string = '';
  readonly email = new FormControl('', [Validators.required, Validators.email]);//email input
  errorMessage = signal('');
  private apiBaseUrl = environment.API_BASE_URL;
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
          email: this.email,
          password: new FormControl('', [Validators.required, Validators.minLength(6)]),
          confirmPassword: new FormControl('', [Validators.required]),
        },
        { validators: this.passwordMatchValidator } // Validator richtig binden
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
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
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
      // Formulardaten abrufen und Feldnamen anpassen
      const formData = {
        email: this.signUpForm.value.email, // Kein Mapping erforderlich
        password: this.signUpForm.value.password, // Kein Mapping erforderlich
        repeated_password: this.signUpForm.value.confirmPassword, // Mapping von confirmPassword
      };
  
      this.registerUser(formData); // Daten an die registerUser-Funktion übergeben
    } else {
      console.log("Form is invalid");
      alert("Bitte füllen Sie alle Felder korrekt aus.");
    }
  }
  
  async registerUser(formData: { email: string; password: string; repeated_password: string }) {
    try {
      const response = await fetch(this.apiBaseUrl +'api/register/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Umgewandelte Daten senden
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Registrierung erfolgreich:", data.message);
        alert("Bitte überprüfe deine E-Mails zur Bestätigung!");
      } else {
        const errorData = await response.json();
        console.error("Fehler:", errorData);
        alert("Registrierung fehlgeschlagen: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
      alert("Ein Netzwerkfehler ist aufgetreten.");
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
