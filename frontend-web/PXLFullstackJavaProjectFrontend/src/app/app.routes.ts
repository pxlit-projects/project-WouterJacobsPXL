import { Routes } from '@angular/router';
import {PostcardListComponent} from "./posts/postcard-list/postcard-list.component";
import {PostComponent} from "./posts/post/post.component";

export const routes: Routes = [
  { path: 'posts', component: PostcardListComponent },
  { path: 'posts/:id', component: PostComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full'}
];
