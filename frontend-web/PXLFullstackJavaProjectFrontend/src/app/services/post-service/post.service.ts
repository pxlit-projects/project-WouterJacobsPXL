import { Injectable } from '@angular/core';
import {catchError, from, map, Observable, throwError} from "rxjs";
import {Post} from "../../models/post.model";
import {Author} from "../../models/author";
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly API_URL = 'http://localhost:8081/api/posts';

  constructor() { }

  getAllPosts(): Observable<Post[]> {
    return from(axios.get(this.API_URL)).pipe(
      map(response => {
        return response.data.map((postData: any) => {
          const author = new Author(
            postData.author.id,
            postData.author.firstName,
            postData.author.lastName
          );

          return new Post(
            postData.id,
            postData.title,
            postData.content,
            postData.previewContent,
            postData.imageUrl,
            author
          );
        });
      })
    );
  }
  // post.service.ts
  getPostById(id: number): Observable<Post> {
    return from(axios.get(`${this.API_URL}/${id}`)).pipe(
      map(response => {
        const postData = response.data;
        const author = new Author(
          postData.author.id,
          postData.author.firstName,
          postData.author.lastName
        );

        return new Post(
          postData.id,
          postData.title,
          postData.content,
          postData.previewContent,
          postData.imageUrl,
          author
        );
      }),
      catchError(error => {
        console.error('Error fetching post:', error);
        return throwError(() => new Error('Failed to fetch post. Please try again later.'));
      })
    );
  }
}
