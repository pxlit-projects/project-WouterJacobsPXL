import {Component, Input, input} from '@angular/core';
import {
  MatCard, MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatButton} from "@angular/material/button";

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
    MatCardActions
  ],
  templateUrl: './postcard.component.html',
  styleUrl: './postcard.component.css'
})
export class PostcardComponent {
  @Input() title!: string;
  @Input() contentTeaser!: string;
  @Input() author!: string;

  hoverCard: boolean = false;

  cardClicked() {
    console.log('CardClicked');
    console.log(this.author);
  }
}
