import {Component, inject, Input, input} from '@angular/core';
import {
  MatCard, MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Post} from "../../models/post.model";
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-postcard',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCardImage,
    MatButton,
    MatCardActions,
    MatIcon
  ],
  templateUrl: './postcard.component.html',
  styleUrl: './postcard.component.css'
})
export class PostcardComponent {
  @Input() post!:Post

  router:Router = inject(Router)
  hoverCard: boolean = false;

  cardClicked() {
    console.log('CardClicked');
    console.log(this.post.author.toString());
    this.router.navigate(['/posts', this.post.id]);
  }
}
