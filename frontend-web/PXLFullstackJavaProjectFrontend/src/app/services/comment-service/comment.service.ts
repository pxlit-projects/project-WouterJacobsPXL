import { Injectable } from '@angular/core';
import {catchError, from, map, Observable, throwError} from "rxjs";
import axios from "axios";
import {environment} from "../../../environments/environment";
export interface Comment {
  id: number;
  postId: number;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  private readonly API_URL = environment.commentApiUrl;
  constructor() { }

  getCommentsForPost(postId: number): Observable<Comment[]> {

    return from(axios.get(this.API_URL + `/posts/${postId}`)).pipe(
      map(response => {
        console.log("getting comments for post", postId)
        return response.data.map((commentData: any) => {
          return {
            id: commentData.id,
            postId: commentData.postId,
            userName: commentData.userName,
            content: commentData.content,
            createdAt: new Date(commentData.createdAt),
            updatedAt: new Date(commentData.updatedAt),
          } as Comment;
        });
      }),
      catchError(error => {
        console.error('Error fetching comments for post:', error);
        return throwError(() => new Error('Failed to fetch comments. Please try again later.'));
      })
    );
  }

  addComment(commentData: { postId: number; userName: string; content: string }): Observable<any> {
    return from(axios.post(this.API_URL, commentData)).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error adding comment:', error);
        return throwError(() => new Error('Failed to add comment. Please try again later.'));
      })
    );
  }

  editComment(commentId: number, userName: string, updatedContent: string): Observable<any> {
    return from(
      axios.put(`${this.API_URL}/${commentId}`, { content: updatedContent }, { params: { userName } })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Error editing comment:', error);
        return throwError(() => new Error('Failed to edit comment. Please try again later.'));
      })
    );
  }

  deleteComment(commentId: number, authorId: number): Observable<void> {
    return from(
      axios.delete(`${this.API_URL}/${commentId}`, { params: { authorId } })
    ).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error('Error deleting comment:', error);
        return throwError(() => new Error('Failed to delete comment. Please try again later.'));
      })
    );
  }

}
