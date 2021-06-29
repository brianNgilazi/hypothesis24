import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { environment } from 'src/environments/environment';

// Angular Fire
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';

const AngularFire = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  AngularFireAuthModule
];

import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { WordOfTheDayComponent } from './components/word-of-the-day/word-of-the-day.component';
import { FeedArticleComponent } from './components/feed-article/feed-article.component';
import { ReadArticleComponent } from './pages/read-article/read-article.component';
import { WriteArticleComponent } from './pages/write-article/write-article.component';
import { TagComponent } from './components/tag/tag.component';
import { ReferencesModalComponent } from './modal/references-modal/references-modal.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { PopularPostsComponent } from './components/popular-posts/popular-posts.component';
import { TagSearchComponent } from './pages/tag-search/tag-search.component';
import {LayoutModule} from '@angular/cdk/layout';
import { TestComponent } from './pages/test/test.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    ProfileComponent,
    HomeComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent,
    WordOfTheDayComponent,
    FeedArticleComponent,
    ReadArticleComponent,
    WriteArticleComponent,
    TagComponent,
    ReferencesModalComponent,
    UploaderComponent,
    PopularPostsComponent,
    TagSearchComponent,
    TestComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFire,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule
  ],
  providers: [
    { provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.emulator ? ['localhost', 8080] : undefined
    },
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.emulator ? ['localhost', 9099] : undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
