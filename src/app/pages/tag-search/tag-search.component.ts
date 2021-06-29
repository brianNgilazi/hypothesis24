import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-tag-search',
  templateUrl: './tag-search.component.html',
  styleUrls: ['./tag-search.component.css']
})
export class TagSearchComponent implements OnInit {

  count$: Observable<number>;
  tags$: Observable<string[]>;
  articles$: Observable<Article[]>;
  tag: string;
  constructor(private route: ActivatedRoute, private articleService: ArticleService) { }

  ngOnInit(): void {
    // this.tag = this.route.snapshot.paramMap.get('tag') || '';
    this.route.paramMap.subscribe(paramMap => {
      this.tag = paramMap.get('tag') || '';
      window.scrollTo(0, 0);
    });
    this.articles$ = this.articleService.getArticlesByTag(this.tag);
    this.count$ = this.articles$.pipe(map(articles => articles.length || 0));
    this.tags$ = this.articleService.getTags();
  }

}
