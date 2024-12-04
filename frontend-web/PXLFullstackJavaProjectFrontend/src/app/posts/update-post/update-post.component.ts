import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { PostService } from '../../services/post-service/post.service';
import { Post } from '../../models/post.model';
import {LoginService} from "../../services/authentication/login.service";

@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent implements OnInit {
  postForm: FormGroup;
  post?: Post;
  loading = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      previewContent: ['', [Validators.required, Validators.maxLength(300)]],
      content: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Check if user is an author
    if (!this.loginService.isAuthor().valueOf()) {
      this.snackBar.open('Only authors can edit posts', 'Close', { duration: 3000 });
      this.router.navigate(['/posts']);
      return;
    }

    // Get post ID from route and fetch post details
    this.route.params.subscribe(params => {
      const postId = +params['id'];
      this.fetchPostDetails(postId);
    });
  }

  fetchPostDetails(postId: number) {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.populateForm(post);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load post details';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }

  populateForm(post: Post) {
    this.postForm.patchValue({
      title: post.title,
      previewContent: post.previewContent,
      content: post.content,
      isConcept: post.isConcept,
      category: post.category
    });
  }

  onSubmit() {
    if (this.postForm.invalid) {
      return;
    }

    if (!this.post) {
      this.snackBar.open('No post selected for update', 'Close', { duration: 3000 });
      return;
    }
    const postData = this.postForm.value;
    postData.id = this.post.id;
    postData.authorId = this.post.author.id
    postData.isConcept = this.post.isConcept
    postData.imageUrl = this.post.imageUrl;


    this.postService.updatePost(postData).subscribe({
      next: () => {
        this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/posts', this.post?.id]);
      },
      error: (error) => {
        this.snackBar.open('Failed to update post', 'Close', { duration: 3000 });
        console.error('Update post error:', error);
      }
    });
  }

  cancelUpdate() {
    this.router.navigate(['/posts', this.post?.id]);
  }
}
