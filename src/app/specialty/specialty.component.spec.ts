import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtyComponent } from './specialty.component';

describe('SpecialityComponent', () => {
  let component: SpecialtyComponent;
  let fixture: ComponentFixture<SpecialtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialtyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
