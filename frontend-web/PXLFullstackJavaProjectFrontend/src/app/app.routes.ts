import { Routes } from '@angular/router';
import {PostcardListComponent} from "./posts/postcard-list/postcard-list.component";
import {PostComponent} from "./posts/post/post.component";
import {AddPostComponent} from "./posts/add-post/add-post.component";

export const routes: Routes = [
  { path: 'posts/new', component: AddPostComponent },
  { path: 'posts', component: PostcardListComponent },
  { path: 'posts/:id', component: PostComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full'}
];
