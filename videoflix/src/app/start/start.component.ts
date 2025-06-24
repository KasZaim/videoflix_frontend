import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from "../footer/footer.component";
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [HeaderComponent, MatButtonModule, FooterComponent,CommonModule, FormsModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  email: string = '';
  isValidEmail: boolean = false;


  constructor(public router: Router, private sharedService: SharedService) {}


  validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = emailRegex.test(email); 
  }
  sendValueAndNavigate(value: string) {
    this.sharedService.updateValue(value);
    this.router.navigate(['/signup']);
  }
}
