import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReadArticleComponent } from './pages/read-article/read-article.component';
import { WriteArticleComponent } from './pages/write-article/write-article.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TagSearchComponent } from './pages/tag-search/tag-search.component';
import { TestComponent } from './pages/test/test.component';
import { AuthGuard } from './guards/auth.guard';

// const redirectLoggedInToItems = () => redirectLoggedInTo(['profile']);
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent},

  { path: 'sign-up', component: SignUpComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'read/:id', component: ReadArticleComponent },

  {
    path: 'write/:id/:draft',
    component: WriteArticleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'write/:id',
    component: WriteArticleComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'write',
    component: WriteArticleComponent,
    canActivate: [AuthGuard],
  },

  { path: 'tags/:tag', component: TagSearchComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'test', component: TestComponent },
  { path: 'home', component: HomeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `home-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

