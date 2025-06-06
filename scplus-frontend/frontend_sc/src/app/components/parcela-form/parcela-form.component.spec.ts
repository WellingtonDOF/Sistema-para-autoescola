import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelaFormComponent } from './parcela-form.component';

describe('ParcelaFormComponent', () => {
  let component: ParcelaFormComponent;
  let fixture: ComponentFixture<ParcelaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
