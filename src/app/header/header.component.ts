import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public router: Router,
    private toastr: ToastrService
  ) {}

  logout() {
    // Token aus dem Speicher entfernen
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Erfolgsmeldung anzeigen
    this.toastr.success('Sie wurden erfolgreich abgemeldet', 'Abmeldung');
    
    // Zur Startseite weiterleiten
    this.router.navigate(['/']);
  }
}
