import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  breakPoint$: Observable<boolean>;
  /**
   * An obsevable that emits a string value when the screen size changes
   * 's','m','l are emitted if the screen is small (<600px), medium (600px-1023px), large (>=1024px)
   */
  size$: Observable<'s'|'m'|'l'>;

  constructor(breakpointObserver: BreakpointObserver) {

    this.size$ = breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Large])
    .pipe(map(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {return 's'; }
      if (result.breakpoints[Breakpoints.Small]) {return 'm'; }
      return 'l';
    }));

    this.breakPoint$ = this.size$.pipe(map(size => size === 's'));
   }
}
