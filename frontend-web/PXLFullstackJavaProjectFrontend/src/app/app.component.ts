import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {PostcardComponent} from "./posts/postcard/postcard.component";
import {MatAnchor, MatButton} from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, PostcardComponent, MatButton, MatAnchor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  posts = [
    {
      title: 'News Article 1',
      contentTeaser: 'This is the content of news article 1.',
      author: 'Frodo'
    },
    {
      title: 'News Article 2',
      contentTeaser: 'This is the content of news article 2.',
      author: 'Sam'
    },
    {
      title: 'News Article 3',
      contentTeaser: 'This is the content of news article 3.',
      author: 'Pippin'
    },
    {
      title: 'News Article 4',
      contentTeaser: 'This is the content of news article 4.',
      author: 'Merry'
    },
    {
      title: 'News Article 5',
      contentTeaser: 'This is the content of news article 5.',
      author: 'Gandalf'
    },
    {
      title: 'News Article 6',
      contentTeaser: 'This is the content of news article 6.',
      author: 'Legolas'
    },
    {
      title: 'News Article 7',
      contentTeaser: 'This is the content of news article 7.',
      author: 'Gimli'
    },
    {
      title: 'News Article 8',
      contentTeaser: 'This is the content of news article 6.',
      author: 'Aragorn'
    },
    {
      title: 'News Article 9',
      contentTeaser: 'This is the content of news article 7.',
      author: 'Boromir'
    }
  ];
}
