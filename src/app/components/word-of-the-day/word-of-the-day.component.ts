import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WOTD } from 'src/app/models/api.model';
import { SubscriptionCollection, SubscriptionManager } from 'src/app/models/subscription-manager';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-word-of-the-day',
  templateUrl: './word-of-the-day.component.html',
  styleUrls: ['./word-of-the-day.component.css']
})

export class WordOfTheDayComponent implements OnInit, OnDestroy {

  word = '';
  wotd$: Observable<WOTD>;
  subscriptions: SubscriptionCollection = {};
  loading = false;


  constructor(private apiService: APIService) { }

  ngOnInit(): void {
    this.wotd$ = this.apiService.getWOTD().pipe(tap(wotd => {
      this.loading = wotd === undefined;
    }));
    this.subscriptions.wotd = this.wotd$.subscribe(res => {
      this.word = res.word;
    });
  }

  ngOnDestroy() {
    SubscriptionManager.unsubscribe(this.subscriptions);
  }

}
