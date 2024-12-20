import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from "../footer/footer.component";
import { Router } from "@angular/router";
import { LogInComponent } from '../log-in/log-in.component';
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [HeaderComponent, MatButtonModule, FooterComponent,CommonModule,LogInComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  backgroundImage: string = '../../assets/img/Diashow.jpeg'; 

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      if (this.router.url === '/login') {
        this.backgroundImage = 'assets/popcorn.jpg';
      } else if (this.router.url === '/signup') {
        this.backgroundImage = 'assets/signup-bg.jpg';
      } else {
        this.backgroundImage = '../../assets/img/Diashow.jpeg'; 
      }
    });
  }
}
