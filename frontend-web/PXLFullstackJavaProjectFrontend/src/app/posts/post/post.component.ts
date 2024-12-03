import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {PostService} from "../../services/post-service/post.service";
import {Post} from "../../models/post.model";
import {LoginService} from "../../services/authentication/login.service";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  post?: Post;
  loading: boolean = true;
  error: string = '';
  loginService: LoginService = inject(LoginService);

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getPost(id);
    });
  }

  private getPost(id: number) {
    this.loading = true;
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching post:', error);
        this.error = 'Failed to load the post. Please try again later.';
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
