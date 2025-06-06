import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesAulaComponent } from './detalhes-aula.component';

describe('DetalhesAulaComponent', () => {
  let component: DetalhesAulaComponent;
  let fixture: ComponentFixture<DetalhesAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
