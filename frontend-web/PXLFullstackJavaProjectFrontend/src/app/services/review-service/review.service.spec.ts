import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { PostInReviewDto } from './review.service';
import axios from 'axios';

describe('ReviewService', () => {
  let service: ReviewService;

  const mockPostInReviewDto: PostInReviewDto = {
    postId: 1,
    title: 'Test Post in Review',
    content: 'Content of post in review',
    previewContent: 'Preview content...',
    imageUrl: 'http://example.com/image.jpg',
    category: 'Test Category',
    author: {
      authorId: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    reviewPostId: 1,
    reviewStatus: 'PENDING',
    reviewerId: 2
  };

  const mockedReviews: PostInReviewDto[] = [mockPostInReviewDto];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
  });

  describe('getNumberOfPendingReviews', () => {
    it('should fetch the number of pending reviews', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.resolve({ data: mockedReviews }));

      service.getNumberOfPendingReviews().then(() => {
        expect(service.numberOfReviews()).toBe(1);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8085/review/api/reviews');
        done();
      }).catch(done.fail);
    });

    it('should handle error when fetching number of pending reviews', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.reject(new Error('Network Error')));

      service.getNumberOfPendingReviews().catch((error) => {
        expect(error.message).toBe('Network Error');
        done();
      });
    });
  });

  describe('getAllReviews', () => {
    it('should fetch all reviews', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.resolve({ data: mockedReviews }));

      service.getAllReviews().then((reviews) => {
        expect(reviews).toEqual(mockedReviews);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8085/review/api/reviews');
        done();
      }).catch(done.fail);
    });

    it('should handle error when fetching all reviews', (done: DoneFn) => {
      spyOn(axios, 'get').and.returnValue(Promise.reject(new Error('Network Error')));

      service.getAllReviews().catch((error) => {
        expect(error.message).toBe('Network Error');
        done();
      });
    });
  });

  describe('updateReviewStatus', () => {
    it('should update the review status', (done: DoneFn) => {
      spyOn(axios, 'put').and.returnValue(Promise.resolve({ data: mockPostInReviewDto }));

      service.updateReviewStatus(1, 'APPROVED', "Bad article").then((response) => {
        expect(response).toEqual(mockPostInReviewDto);
        expect(axios.put).toHaveBeenCalledWith('http://localhost:8085/review/api/reviews', {
          reviewPostId: 1,
          reviewStatus: 'APPROVED',
          rejectionReason: "Bad article"
        });
        done();
      }).catch(done.fail);
    });

    it('should handle error when updating review status', (done: DoneFn) => {
      spyOn(axios, 'put').and.returnValue(Promise.reject(new Error('Network Error')));

      service.updateReviewStatus(1, 'APPROVED').catch((error) => {
        expect(error.message).toBe('Network Error');
        done();
      });
    });
  });
});
