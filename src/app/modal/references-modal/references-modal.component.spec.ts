import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencesModalComponent } from './references-modal.component';

describe('ReferencesModalComponent', () => {
  let component: ReferencesModalComponent;
  let fixture: ComponentFixture<ReferencesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferencesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
