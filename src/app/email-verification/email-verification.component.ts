
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {
  loading = true; // Zeigt den Ladezustand an
  success = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const uid = this.route.snapshot.queryParamMap.get('uid');
    const token = this.route.snapshot.queryParamMap.get('token');
  
    if (uid && token) {
      // Anfrage an das Backend senden, um die Verifizierung durchzuführen
      this.http
        .get<any>(`http://localhost:8000/api/confirm-email/${uid}/${token}/`)
        .subscribe({
          next: (response: any) => {
            console.log('Bestätigung erfolgreich:', response);
  
            if (response.redirect_url) {
              // Weiterleitung zur Login-Seite basierend auf der Backend-Antwort
              this.router.navigateByUrl(response.redirect_url);
            } else {
              console.error('Keine Weiterleitungs-URL in der Antwort enthalten.');
              this.success = false; // Fehler
              this.loading = false; // Ladezustand beenden
            }
  
            this.success = true; // Erfolg
            this.loading = false; // Ladezustand beenden
          },
          error: (error: any) => {
            console.error('Fehler bei der Bestätigung:', error);
            this.success = false; // Fehler
            this.loading = false; // Ladezustand beenden
          },
          complete: () => {
            console.log('Verifizierungsprozess abgeschlossen.');
          },
        });
    } else {
      this.loading = false; // Ladezustand beenden, wenn keine Parameter vorhanden sind
      this.success = false; // Setze Erfolg auf false
    }
  }
  
  
  // Benutzer zum Login weiterleiten
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
  
}
