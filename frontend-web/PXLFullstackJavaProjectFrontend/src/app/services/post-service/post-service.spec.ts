import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { Post } from "../../models/post.model";
import { Author } from "../../models/author";
import axios from 'axios';
import { ReviewService } from '../review-service/review.service';

describe('PostService', () => {
  let service: PostService;
  let reviewService: ReviewService;

  const author: Author = new Author(1, "John", "Doe");
  const post1: Post = new Post(1, 'Test Post', false, 'This is a test post.', 'This is a test...', 'http://example.com/image.jpg', 'Test', author);
  const post2: Post = new Post(2, 'Test Post', false, 'This is a test post.', 'This is a test...', 'http://example.com/image.jpg', 'Test', author);
  const mockedPosts = [post1, post2];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostService,
        {
          provide: ReviewService,
          useValue: { getNumberOfPendingReviews: jasmine.createSpy('getNumberOfPendingReviews') }
        }
      ]
    });
    service = TestBed.inject(PostService);
    reviewService = TestBed.inject(ReviewService);
  });

  // Previous tests remain the same...

  describe('getPostById', () => {
    it('should fetch a post by id', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.resolve({ data: post1 }));

      service.getPostById(1).subscribe({
        next: (post) => {
          expect(post).toEqual(post1);
          expect(axios.get).toHaveBeenCalledWith('http://localhost:8085/post/api/posts/1');
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when fetching post by id', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.reject(new Error('Network Error')));

      service.getPostById(1).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch post. Please try again later.');
          done();
        }
      });
    });
  });

  describe('createPost', () => {
    const newPostData = { title: 'New Post', content: 'Content' };

    it('should create a new post', (done: DoneFn) => {
      spyOn(axios, 'post').and.returnValue(Promise.resolve({ data: post1 }));

      service.createPost(newPostData).subscribe({
        next: (response) => {
          expect(response).toEqual(post1);
          expect(axios.post).toHaveBeenCalledWith('http://localhost:8085/post/api/posts', newPostData);
          expect(reviewService.getNumberOfPendingReviews).toHaveBeenCalled();
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when creating post', (done: DoneFn) => {
      spyOn(axios, 'post').and.returnValue(Promise.reject(new Error('Network Error')));

      service.createPost(newPostData).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to create post. Please try again later.');
          done();
        }
      });
    });
  });

  describe('createConcept', () => {
    const conceptData = { title: 'New Concept', content: 'Draft Content' };

    it('should create a new concept', (done: DoneFn) => {
      spyOn(axios, 'post').and.returnValue(Promise.resolve({ data: post1 }));

      service.createConcept(conceptData).subscribe({
        next: (response) => {
          expect(response).toEqual(post1);
          expect(axios.post).toHaveBeenCalledWith('http://localhost:8085/post/api/posts/concepts', conceptData);
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when creating concept', (done: DoneFn) => {
      spyOn(axios, 'post').and.returnValue(Promise.reject(new Error('Network Error')));

      service.createConcept(conceptData).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to create concept. Please try again later.');
          done();
        }
      });
    });
  });

  describe('deleteConcept', () => {
    it('should delete a concept', (done: DoneFn) => {
      spyOn(axios, 'delete').and.returnValue(Promise.resolve({ data: {} }));

      service.deleteConcept(1).subscribe({
        next: () => {
          expect(axios.delete).toHaveBeenCalledWith('http://localhost:8085/post/api/posts/concepts/1');
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when deleting concept', (done: DoneFn) => {
      spyOn(axios, 'delete').and.returnValue(Promise.reject(new Error('Network Error')));

      service.deleteConcept(1).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to delete concept. Please try again later.');
          done();
        }
      });
    });
  });

  describe('getConceptsByAuthorId', () => {
    const authorId = 1;
    const conceptPosts = [
      {
        id: 1,
        title: 'Concept 1',
        isConcept: true,
        content: 'Content 1',
        previewContent: 'Preview 1',
        imageUrl: 'image1.jpg',
        category: 'Test',
        author: {
          id: authorId,  // matching the authorId we're filtering for
          firstName: 'John',
          lastName: 'Doe'
        }
      },
      {
        id: 2,
        title: 'Concept 2',
        isConcept: true,
        content: 'Content 2',
        previewContent: 'Preview 2',
        imageUrl: 'image2.jpg',
        category: 'Test',
        author: {
          id: authorId,  // matching the authorId we're filtering for
          firstName: 'John',
          lastName: 'Doe'
        }
      },
      {
        id: 3,
        title: 'Concept 3',
        isConcept: true,
        content: 'Content 3',
        previewContent: 'Preview 3',
        imageUrl: 'image3.jpg',
        category: 'Test',
        author: {
          id: 999,  // different authorId that should be filtered out
          firstName: 'Jane',
          lastName: 'Smith'
        }
      }
    ];

    it('should fetch concepts by author id', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.resolve({ data: conceptPosts }));

      service.getConceptsByAuthorId(authorId).subscribe({
        next: (posts) => {
          // Should only get 2 posts since the third has a different author ID
          expect(posts.length).toBe(2);
          expect(posts[0].author.id).toBe(authorId);
          expect(posts[1].author.id).toBe(authorId);
          expect(axios.get).toHaveBeenCalledWith('http://localhost:8085/post/api/posts/concepts');
          done();
        },
        error: done.fail
      });
    });

    it('should return empty array on error', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.reject(new Error('Network Error')));

      service.getConceptsByAuthorId(authorId).subscribe({
        next: (posts) => {
          expect(posts).toEqual([]);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('updatePost', () => {
    const updatedPostData = { ...post1, title: 'Updated Title' };

    it('should update a post', (done: DoneFn) => {
      spyOn(axios, 'put').and.returnValue(Promise.resolve({ data: updatedPostData }));

      service.updatePost(updatedPostData).subscribe({
        next: (response) => {
          expect(response).toEqual(updatedPostData);
          expect(axios.put).toHaveBeenCalledWith('http://localhost:8085/post/api/posts', updatedPostData);
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when updating post', (done: DoneFn) => {
      spyOn(axios, 'put').and.returnValue(Promise.reject(new Error('Network Error')));

      service.updatePost(updatedPostData).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to update post. Please try again later.');
          done();
        }
      });
    });
  });
});
