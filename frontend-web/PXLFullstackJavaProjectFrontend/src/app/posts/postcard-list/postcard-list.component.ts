import {Component, inject, OnInit} from '@angular/core';
import {Post} from "../../models/post.model";
import {PostService} from "../../services/post-service/post.service";
import {PostcardComponent} from "../postcard/postcard.component";
import {FormsModule} from "@angular/forms";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-postcard-list',
  standalone: true,
  imports: [
    PostcardComponent,
    FormsModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    MatLabel
  ],
  templateUrl: './postcard-list.component.html',
  styleUrl: './postcard-list.component.css'
})
export class PostcardListComponent implements OnInit{
  posts: Post[] = [];
  filteredPosts: Post[] = [];

  // Filter properties
  authorFilter: string = '';
  categoryFilter: string = '';
  contentFilter: string = '';

  postService: PostService = inject(PostService);

  ngOnInit() {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.filteredPosts = posts;
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      }
    });
  }

  applyFilters() {
    this.filteredPosts = this.posts.filter(post => {
      const authorMatch = this.authorFilter.toLowerCase() === '' ||
        `${post.author.firstName} ${post.author.lastName}`.toLowerCase().includes(this.authorFilter.toLowerCase());

      const categoryMatch = this.categoryFilter.toLowerCase() === '' ||
        (post as any).category?.toLowerCase().includes(this.categoryFilter.toLowerCase());

      const contentMatch = this.contentFilter.toLowerCase() === '' ||
        post.content.toLowerCase().includes(this.contentFilter.toLowerCase()) ||
        post.title.toLowerCase().includes(this.contentFilter.toLowerCase()) ||
        post.previewContent.toLowerCase().includes(this.contentFilter.toLowerCase());

      return authorMatch && categoryMatch && contentMatch;
    });
  }

  resetFilters() {
    this.authorFilter = '';
    this.categoryFilter = '';
    this.contentFilter = '';
    this.filteredPosts = this.posts;
  }
}
