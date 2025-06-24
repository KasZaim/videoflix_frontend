import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { HeaderComponent } from '../header/header.component';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [HeaderComponent,MatButtonModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  constructor(public location: Location) {}
}
