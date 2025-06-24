import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard = () => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Prüfe ob Token im localStorage oder sessionStorage existiert
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (token) {
    return true; // Benutzer ist eingeloggt
  }

  // Benutzer ist nicht eingeloggt
  toastr.error('Bitte melden Sie sich an, um auf das Dashboard zuzugreifen', 'Zugriff verweigert');
  router.navigate(['/']);
  return false;
}; 