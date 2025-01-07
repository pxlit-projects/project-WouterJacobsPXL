import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {PostcardComponent} from "./posts/postcard/postcard.component";
import {MatAnchor, MatButton} from "@angular/material/button";
import {PostcardListComponent} from "./posts/postcard-list/postcard-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, PostcardComponent, MatButton, MatAnchor, PostcardListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
