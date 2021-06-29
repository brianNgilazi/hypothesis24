import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Article } from 'src/app/models/article.model';
import { SubscriptionCollection, SubscriptionManager } from 'src/app/models/subscription-manager';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-read-article',
  templateUrl: './read-article.component.html',
  styleUrls: ['./read-article.component.css']
})
export class ReadArticleComponent implements OnInit, OnDestroy {

  private articleId: string;
  public article$: Observable<Article>;
  private subscriptions: SubscriptionCollection = {};


  constructor(public articlesService: ArticleService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.article$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.articleId = params.get('id');
        return this.articlesService.getArticle(this.articleId);
      })
    );
    this.subscriptions.articles = this.article$.subscribe(article => {
      
    })
  }

  ngOnDestroy(){
    SubscriptionManager.unsubscribe(this.subscriptions);
  }

}
