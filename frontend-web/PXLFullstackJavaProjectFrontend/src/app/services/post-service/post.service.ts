import {inject, Injectable} from '@angular/core';
import {catchError, filter, from, map, Observable, of, throwError} from "rxjs";
import {Post} from "../../models/post.model";
import {Author} from "../../models/author";
import axios from "axios";
import {ReviewService} from "../review-service/review.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly API_URL= environment.postApiUrl

  reviewService: ReviewService = inject(ReviewService);

  constructor() {
  }

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
            postData.isConcept,
            postData.content,
            postData.previewContent,
            postData.imageUrl,
            postData.category,
            author
          );
        });
      })
    );
  }

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
          postData.isConcept,
          postData.content,
          postData.previewContent,
          postData.imageUrl,
          postData.category,
          author
        );

      }),
      catchError(error => {
        console.error('Error fetching post:', error);
        return throwError(() => new Error('Failed to fetch post. Please try again later.'));
      })
    );
  }

  createPost(postData: any): Observable<any> {
    return from(axios.post(this.API_URL, postData)).pipe(
      map(response => {
        this.reviewService.getNumberOfPendingReviews();
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating post:', error);
        return throwError(() => new Error('Failed to create post. Please try again later.'));
      })
    );
  }

  createConcept(postData: any): Observable<any> {
    return from(axios.post(this.API_URL + "/concepts", postData)).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error creating concept:', error);
        return throwError(() => new Error('Failed to create concept. Please try again later.'));
      })
    );
  }

  deleteConcept(id: number): Observable<any> {
    return from(axios.delete(this.API_URL + `/concepts/${id}`)).pipe(
      catchError(error => {
        console.error('Error deleting concept:', error);
        return throwError(() => new Error('Failed to delete concept. Please try again later.'));
      })
    );
  }

  getConceptsByAuthorId(authorId: number): Observable<Post[]> {
    console.log("getting concepts");
    return from(axios.get(this.API_URL + "/concepts")).pipe(
      map(response => {
        console.log(response);
        return response.data.filter((postData: any) => postData.author.id === authorId)
          .map((postData: any) => {
            const author = new Author(
              postData.author.id,
              postData.author.firstName,
              postData.author.lastName
            );

            return new Post(
              postData.id,
              postData.title,
              postData.isConcept,
              postData.content,
              postData.previewContent,
              postData.imageUrl,
              postData.category,
              author
            );
          });
      }),
      catchError(error => {
        console.error('Error fetching concepts:', error);
        return of([]);
      })
    );
  }

  updatePost(postData: any): Observable<any> {
    return from(axios.put(`${this.API_URL}`, postData)).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error updating post:', error);
        return throwError(() => new Error('Failed to update post. Please try again later.'));
      })
    );
  }
}
