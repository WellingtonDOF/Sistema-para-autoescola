import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulaComponent } from './aula.component';

describe('AulaComponent', () => {
  let component: AulaComponent;
  let fixture: ComponentFixture<AulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
