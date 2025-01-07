import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {async, Observable} from 'rxjs';
import axios from "axios";

export interface PostInReviewDto {
  postId: number;
  title: string;
  content: string;
  previewContent: string;
  imageUrl: string;
  category: string;
  author: {
    authorId: number;
    name: string;
    email: string;
  };
  reviewPostId: number;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED';
  reviewerId: number;
}

interface UpdateReviewStatusDto {
  reviewPostId: number;
  reviewStatus: string;
  rejectionReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = "http://localhost:8085/review/api/reviews";

  numberOfReviews = signal(0)

  async getNumberOfPendingReviews(): Promise<void> {
    try {
      const response = await axios.get<PostInReviewDto[]>(this.apiUrl);
      this.numberOfReviews.set(response.data.length);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async getAllReviews(): Promise<PostInReviewDto[]> {
    console.log("getting reviews..");
    console.log(this.apiUrl);

    try {
      const response = await axios.get<PostInReviewDto[]>(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async updateReviewStatus(reviewPostId: number, status: string, rejectionReason?: string): Promise<any> {
    try {
      const requestDto: UpdateReviewStatusDto = {
        reviewPostId,
        reviewStatus: status,
        rejectionReason
      };
      const response = await axios.put(`${this.apiUrl}`, requestDto);
      this.getNumberOfPendingReviews();
      return response.data;
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  }
}
