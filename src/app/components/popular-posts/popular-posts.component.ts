import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-popular-posts',
  templateUrl: './popular-posts.component.html',
  styleUrls: ['./popular-posts.component.css']
})
export class PopularPostsComponent implements OnInit {

  topArticles: Observable<Article[]>;
  constructor(private articleService: ArticleService, private router: Router) { }

  ngOnInit(): void {
    this.topArticles = this.articleService.getTopArticles();
  }

  read(id: string){
    this.router.navigate(['/read', id]);
  }

}
