import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  articles$: BehaviorSubject<Article[]> = null;
  tags$: Observable<string[]> = null;

  tags: string[] = [];

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.articles$ = this.articleService.getAllArticles();
    this.tags$ = this.articleService.getTags();

  }

}
