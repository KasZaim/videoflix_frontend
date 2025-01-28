import { Component, OnInit,signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule,Validators,FormControl,FormGroup,AbstractControl, ValidationErrors } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ 
    HeaderComponent, 
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,MatInputModule,MatIconModule,MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup; // FormGroup für das Formular
  message: string = '';
  error: string = '';
  uid: string | null = null;
  token: string | null = null;
  private apiBaseUrl = environment.API_BASE_URL;
  
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.queryParamMap.get('uid');
    this.token = this.route.snapshot.queryParamMap.get('token');

    // Initialisierung der FormGroup
    this.resetPasswordForm = new FormGroup(
      {
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Passwort-Matching-Validator
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.uid || !this.token) {
      this.error = 'Bitte fülle alle Felder korrekt aus.';
      return;
    }

    const { newPassword } = this.resetPasswordForm.value;

    this.http
      .post<any>(`${this.apiBaseUrl}/api/reset-password/`, {
        uid: this.uid,
        token: this.token,
        new_password: newPassword,
      })
      .subscribe({
        next: () => {
          this.toastr.success(
            'Passwort erfolgreich zurückgesetzt. Du wirst zur Login-Seite weitergeleitet.',
            'Erfolg'
          );
          setTimeout(() => this.router.navigate(['/login']), 3000); // Weiterleitung nach 3 Sekunden
        },
        error: (err) => {
          const errorMessage =
            err.error?.error || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
          this.toastr.error(errorMessage, 'Fehler');
        },
      });
  }

  
}
