import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = "http://localhost:8085/review/api/reviews";

  async getNumberOfPendingReviews(): Promise<number> {
    try {
      const response = await axios.get<PostInReviewDto[]>(this.apiUrl);
      return response.data.length > 0 ? response.data.length : 0;
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

  async getPendingReviews(): Promise<PostInReviewDto[]> {
    try {
      const response = await axios.get<PostInReviewDto[]>(`${this.apiUrl}/pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      throw error;
    }
  }

  async updateReviewStatus(reviewPostId: number, status: string): Promise<any> {
    try {
      const response = await axios.patch(`${this.apiUrl}/${reviewPostId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  }
}
