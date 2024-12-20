import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [HeaderComponent, MatButtonModule, FooterComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

}
