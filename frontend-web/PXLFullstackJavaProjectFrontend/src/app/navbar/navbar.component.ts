import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {LoginService} from "../services/authentication/login.service";
import {MatBadge} from "@angular/material/badge";
import {ReviewService} from "../services/review-service/review.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbar,
    MatButton,
    MatIcon,
    RouterLink,
    MatBadge
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
    this.reviewService.getNumberOfPendingReviews();
  }
  loginService: LoginService = inject(LoginService);
  reviewService: ReviewService = inject(ReviewService);
}
