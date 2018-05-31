import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailPageComponent } from './report-detail-page.component';

describe('ReportDetailPageComponent', () => {
  let component: ReportDetailPageComponent;
  let fixture: ComponentFixture<ReportDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
