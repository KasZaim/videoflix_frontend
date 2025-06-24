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
    // Token und uid aus den Query-Parametern extrahieren
    this.route.queryParams.subscribe(params => {
      const uid = params['uid'];
      const token = params['token'];
      
      if (uid && token) {
        console.log("Parameter gefunden:", uid, token); // Debugging
        this.verifyEmail(uid, token);
      } else {
        this.loading = false;
        this.success = false;
        this.toastr.error('Verifizierungsdaten unvollständig', 'Fehler');
      }
    });
  }
  

  verifyEmail(uid: string, token: string): void {
    // GET-Anfrage an deine bestehende Django-URL
    this.http.get(`${this.apiBaseUrl}api/confirm-email/${uid}/${token}/`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.success = true;
          this.toastr.success('Ihre E-Mail wurde erfolgreich bestätigt', 'Erfolg');
          
          // Weiterleitung, wenn eine Redirect-URL zurückgegeben wird
          if (response.redirect_url) {
            setTimeout(() => {
              this.router.navigateByUrl(response.redirect_url);
            }, 2000);
          }
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
