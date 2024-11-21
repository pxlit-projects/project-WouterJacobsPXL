import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {LoginService} from "../services/authentication/login.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbar,
    MatButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService: LoginService = inject(LoginService);

}
