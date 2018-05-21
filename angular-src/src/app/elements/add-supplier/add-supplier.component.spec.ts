import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierElemComponent } from './add-supplier.component';

describe('AddSupplierComponent', () => {
  let component: SupplierElemComponent;
  let fixture: ComponentFixture<SupplierElemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierElemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
