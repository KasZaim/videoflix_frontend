import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent implements OnInit {
  loading = true;
  success = false;
  private apiBaseUrl = environment.API_BASE_URL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Token aus der URL extrahieren
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.loading = false;
        this.success = false;
        this.toastr.error('Kein Verifizierungstoken gefunden', 'Fehler');
      }
    });
  }

  verifyEmail(token: string): void {
    this.http.post(`${this.apiBaseUrl}/api/verify-email/`, { token })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;
          this.toastr.success('Ihre E-Mail wurde erfolgreich bestätigt', 'Erfolg');
        },
        error: (error) => {
          this.loading = false;
          this.success = false;
          this.toastr.error('Der Verifizierungslink ist ungültig oder abgelaufen', 'Fehler');
          console.error('Fehler bei der E-Mail-Verifizierung:', error);
        }
      });
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
