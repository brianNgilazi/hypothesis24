import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { SubscriptionCollection, SubscriptionManager } from 'src/app/models/subscription-manager';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-feed-article',
  templateUrl: './feed-article.component.html',
  styleUrls: ['./feed-article.component.css']
})
export class FeedArticleComponent implements OnInit, OnDestroy {

  @Input()
  get article(): Article {
    return this.feedArticle;
  }

  set article(article: Article) {
    this.feedArticle = article;
    this.parseBody();
  }

  feedArticle: Article;
  readMore = true;
  preview = '';
  previewLength = 280;
  subscriptions: SubscriptionCollection = {};
  loading = false;


  constructor(private router: Router, private screenService: ScreenService) { }

  ngOnInit(): void {
    this.loading = true;
    this.subscriptions.bp = this.screenService.breakPoint$.subscribe(val => {
      this.loading = true;
      this.previewLength = val ? 140 : 280;
      this.parseBody();
      this.loading = false;
    });
  }

  ngOnDestroy(){
    SubscriptionManager.unsubscribe(this.subscriptions);
  }

  parseBody(){
    this.readMore = this.article.body.length > this.previewLength;
    if (this.readMore) {
      this.preview = this.article.body.slice(0, this.previewLength);
      const stop = this.preview.lastIndexOf(' ');
      this.preview = this.preview.slice(0, stop) + '...';
    }
  }

  onRead(){
    this.router.navigate(['read', this.article.id]);
  }

}
