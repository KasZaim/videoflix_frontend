import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormControl, Validators,FormsModule, ReactiveFormsModule, } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
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
    HttpClientModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  errorMessage = signal('');
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  private apiBaseUrl = environment.API_BASE_URL;
  message: string = '';
  error: string = '';
  
  constructor(public router : Router, private http: HttpClient,private toastr: ToastrService){

  }

  goBack() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.email.invalid) {
      this.updateErrorMessage();
      return;
    }
  
    this.http.post<any>(`${this.apiBaseUrl}api/forgot-password/`, { email: this.email.value })
      .subscribe({
        next: () => {
          // Erfolgsmeldung im Toast anzeigen
          this.toastr.success('Password reset instructions have been sent to your email.', 'Success', {
            timeOut: 5000, // Toast wird nach 5 Sekunden ausgeblendet
            positionClass: 'toast-top-right', // Position oben rechts
            closeButton: true // Schließen-Button aktivieren
          });
          this.error = '';
        },
        error: (err) => {
          // Fehlermeldung im Toast anzeigen
          this.toastr.error(
            err.error?.message || 'An error occurred. Please try again later.',
            'Error', {
              timeOut: 5000,
              positionClass: 'toast-top-right',
              closeButton: true
            }
          );
          this.message = '';
        }
      });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.toastr.error('You must enter an email address.', 'Validation Error');
    } else if (this.email.hasError('email')) {
      this.toastr.error('The email address is invalid.', 'Validation Error');
    }
  }
}
