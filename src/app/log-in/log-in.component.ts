import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormControl, Validators,FormsModule, ReactiveFormsModule, } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { merge } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [HeaderComponent, 
    FooterComponent,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})

export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);//email input
  errorMessage = signal('');

  hide = signal(true); //password input
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(public router : Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
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
