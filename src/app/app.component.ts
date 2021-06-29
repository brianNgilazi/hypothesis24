import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ScreenService } from './services/screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hypothesis 24'.toUpperCase();
  year = new Date().getFullYear();

  constructor(public auth: AuthService){
  }

  onActivate(val){
    window.scroll(0, 0);
  }
}
