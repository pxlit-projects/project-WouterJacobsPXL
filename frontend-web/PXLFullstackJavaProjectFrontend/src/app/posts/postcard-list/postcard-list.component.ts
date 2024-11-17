import {Component, inject, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {PostService} from "../../services/post-service/post.service";
import {PostcardComponent} from "../postcard/postcard.component";

@Component({
  selector: 'app-postcard-list',
  standalone: true,
  imports: [
    PostcardComponent
  ],
  templateUrl: './postcard-list.component.html',
  styleUrl: './postcard-list.component.css'
})
export class PostcardListComponent implements OnInit{
    posts!: Post[];

    postService: PostService = inject(PostService);

    ngOnInit() {
      this.postService.getAllPosts().subscribe({
        next: (posts) => {
          this.posts = posts;
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
        }
      });
    }
}
