import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from "../footer/footer.component";
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [HeaderComponent, MatButtonModule, FooterComponent,CommonModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

  constructor(public router: Router, private sharedService: SharedService) {}

  sendValueAndNavigate(value: string) {
    this.sharedService.updateValue(value);
    this.router.navigate(['/signup']);
  }
}
