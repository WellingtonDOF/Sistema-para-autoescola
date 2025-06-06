import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrutorComponent } from './instrutor.component';

describe('InstrutorComponent', () => {
  let component: InstrutorComponent;
  let fixture: ComponentFixture<InstrutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
