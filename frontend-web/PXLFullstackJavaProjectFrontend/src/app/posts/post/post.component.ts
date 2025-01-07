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
import {MatDialog} from "@angular/material/dialog";
import {AddCommentDialogComponent} from "../add-comment-dialog/add-comment-dialog.component";
import {CommentService} from "../../services/comment-service/comment.service";
import {BlogComment} from "../../models/BlogComment";

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
  commentService: CommentService = inject(CommentService);
  comments: BlogComment[] = []
  route:ActivatedRoute = inject(ActivatedRoute);
  postService: PostService = inject(PostService);
  dialog: MatDialog = inject(MatDialog);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getPost(id);
      this.loadComments(id);
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

  openAddCommentDialog(): void {
    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newComment = {
          postId: this.post?.id || 0, // Use the current post's ID
          userName: result.userName,
          content: result.content,
        };

        this.commentService.addComment(newComment).subscribe({
          next: () => {
            // Reload the comments after successfully adding the comment
            if (this.post?.id) {
              this.loadComments(this.post.id);
            }
          },
          error: (error) => {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again later.');
          },
        });
      }
    });
  }

  editComment(comment: any, commentId: number): void {
    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      width: '400px',
      data: {
        content: comment.content,
        userName: comment.userName
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.content) {
        this.commentService.editComment(commentId, comment.userName, result.content).subscribe({
          next: (updatedComment) => {
            const commentToUpdate = this.comments.find(c => c.id === commentId);
            if (commentToUpdate) {
              commentToUpdate.content = updatedComment.content;
              commentToUpdate.updatedAt = new Date(updatedComment.updatedAt);
            }
          },
          error: (error) => {
            console.error('Error editing comment:', error);
            alert('Failed to update the comment. Please try again.');
          },
        });
      }
    });
  }


  deleteComment(commentId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this comment?');
    if (confirmDelete) {
      const authorId = this.post?.author?.id || 0; // Get the author ID (logged-in user check)
      this.commentService.deleteComment(commentId, authorId).subscribe({
        next: () => {
          this.comments = this.comments.filter((comment) => comment.id !== commentId); // Remove from UI
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          alert('Failed to delete the comment. Please try again.');
        },
      });
    }
  }

  private loadComments(postId: number): void {
    this.commentService.getCommentsForPost(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
        this.comments = []; // Fallback to an empty comments array
      }
    });
  }

  getLoggedInUser(): string {
    return (localStorage.getItem("userName") || "").toString();
  }
}
