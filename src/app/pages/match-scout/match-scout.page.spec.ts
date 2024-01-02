import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchScoutPage } from './match-scout.page';

describe('MatchScoutPage', () => {
  let component: MatchScoutPage;
  let fixture: ComponentFixture<MatchScoutPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MatchScoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
