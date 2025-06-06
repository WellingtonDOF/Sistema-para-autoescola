import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesParcelaComponent } from './detalhes-parcela.component';

describe('DetalhesParcelaComponent', () => {
  let component: DetalhesParcelaComponent;
  let fixture: ComponentFixture<DetalhesParcelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesParcelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesParcelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
