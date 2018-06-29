import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReceiptPageComponent } from './update-receipt-page.component';

describe('UpdateReceiptPageComponent', () => {
  let component: UpdateReceiptPageComponent;
  let fixture: ComponentFixture<UpdateReceiptPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateReceiptPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateReceiptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
