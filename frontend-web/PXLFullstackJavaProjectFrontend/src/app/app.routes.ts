import { Routes } from '@angular/router';
import {PostcardListComponent} from "./posts/postcard-list/postcard-list.component";
import {PostComponent} from "./posts/post/post.component";
import {AddPostComponent} from "./posts/add-post/add-post.component";
import {LoginComponent} from "./login/login.component";
import {authenticationGuard} from "./routeGuards/authentication.guard";
import {UpdatePostComponent} from "./posts/update-post/update-post.component";
import {PostReviewComponent} from "./posts/post-review/post-review.component";

export const routes: Routes = [
  { path: 'posts/new', component: AddPostComponent, canActivate: [authenticationGuard], data: { roles: ['author'] }},
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostcardListComponent },
  { path: 'posts/reviews', component: PostReviewComponent, canActivate: [authenticationGuard], data: { roles: ['author'] } },
  { path: 'posts/:id', component: PostComponent },
  { path: 'posts/:id/edit', component: UpdatePostComponent, canActivate: [authenticationGuard], data: { roles: ['author'] } },
  { path: '', redirectTo: '/posts', pathMatch: 'full'}
];
