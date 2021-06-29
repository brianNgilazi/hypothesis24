import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article.model';
import { SubscriptionCollection, SubscriptionManager } from 'src/app/models/subscription-manager';
import { User } from 'src/app/models/user.model';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  form: FormGroup = null;
  errorMessage: string;
  userArticles: Observable<Article[]>;
  drafts$: Observable<Article[]>;
  user: User;
  subscriptions: SubscriptionCollection = {};

  constructor(private authService: AuthService, private articleService: ArticleService) { }

  ngOnInit(): void {
    this.subscriptions.user = this.authService.user$.subscribe(user => {
      this.user = user;
      this.form.patchValue(user);
      this.getDrafts();
      this.getArticles();
    });
    this.createForm();

  }

  ngOnDestroy() {
    SubscriptionManager.unsubscribe(this.subscriptions);
  }

  getArticles(){
    this.userArticles = this.articleService.getUserArticles();
  }



  getDrafts(){
    this.drafts$ = this.articleService.getUserDrafts();
  }

  createForm(){
    this.form = new FormGroup({
      username: new FormControl('', [Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.form.controls.email.disable();
  }

  update(formValue){
    this.authService.updateProfile({...this.user, ...formValue});
    window.alert('Profile Updated');
  }


}
