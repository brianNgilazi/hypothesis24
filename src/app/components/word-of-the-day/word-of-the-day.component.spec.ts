import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordOfTheDayComponent } from './word-of-the-day.component';

describe('WordOfTheDayComponent', () => {
  let component: WordOfTheDayComponent;
  let fixture: ComponentFixture<WordOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordOfTheDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
