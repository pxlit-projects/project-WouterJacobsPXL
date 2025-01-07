import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';
import axios from 'axios';

describe('CommentService', () => {
  let service: CommentService;

  const mockComment = {
    id: 1,
    postId: 1,
    userName: 'John Doe',
    content: 'This is a comment.',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockComments = [mockComment];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
  });

  describe('getCommentsForPost', () => {
    it('should fetch comments for a post', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.resolve({ data: mockComments }));

      service.getCommentsForPost(1).subscribe({
        next: (comments) => {
          expect(comments.length).toBe(1);
          expect(comments[0]).toEqual(mockComment);
          expect(axios.get).toHaveBeenCalledWith('http://localhost:8085/comment/api/comments/posts/1');
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when fetching comments for a post', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.reject(new Error('Network Error')));

      service.getCommentsForPost(1).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch comments. Please try again later.');
          done();
        }
      });
    });
  });

  describe('addComment', () => {
    const newCommentData = { postId: 1, userName: 'John Doe', content: 'New comment' };

    it('should add a new comment', (done: DoneFn) => {
      spyOn(axios, 'post').and.returnValue(Promise.resolve({ data: mockComment }));

      service.addComment(newCommentData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockComment);
          expect(axios.post).toHaveBeenCalledWith('http://localhost:8085/comment/api/comments', newCommentData);
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when adding a comment', (done: DoneFn) => {
      spyOn(axios, 'post').and.returnValue(Promise.reject(new Error('Network Error')));

      service.addComment(newCommentData).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to add comment. Please try again later.');
          done();
        }
      });
    });
  });

  describe('editComment', () => {
    const updatedCommentData = { userName: 'John Doe', updatedContent: 'Updated content' };

    it('should edit a comment', (done: DoneFn) => {
      spyOn(axios, 'put').and.returnValue(Promise.resolve({ data: mockComment }));

      service.editComment(1, 'John Doe', 'Updated content').subscribe({
        next: (response) => {
          expect(response).toEqual(mockComment);
          expect(axios.put).toHaveBeenCalledWith('http://localhost:8085/comment/api/comments/1',
            { content: 'Updated content' }, { params: { userName: 'John Doe' } });
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when editing a comment', (done: DoneFn) => {
      spyOn(axios, 'put').and.returnValue(Promise.reject(new Error('Network Error')));

      service.editComment(1, 'John Doe', 'Updated content').subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to edit comment. Please try again later.');
          done();
        }
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', (done: DoneFn) => {
      spyOn(axios, 'delete').and.returnValue(Promise.resolve({ data: {} }));

      service.deleteComment(1, 1).subscribe({
        next: () => {
          expect(axios.delete).toHaveBeenCalledWith('http://localhost:8085/comment/api/comments/1',
            { params: { authorId: 1 } });
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when deleting a comment', (done: DoneFn) => {
      spyOn(axios, 'delete').and.returnValue(Promise.reject(new Error('Network Error')));

      service.deleteComment(1, 1).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (error) => {
          expect(error.message).toBe('Failed to delete comment. Please try again later.');
          done();
        }
      });
    });
  });
});
