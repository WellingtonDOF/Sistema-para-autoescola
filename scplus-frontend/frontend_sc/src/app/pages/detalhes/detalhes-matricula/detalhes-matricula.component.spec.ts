import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesMatriculaComponent } from './detalhes-matricula.component';

describe('DetalhesMatriculaComponent', () => {
  let component: DetalhesMatriculaComponent;
  let fixture: ComponentFixture<DetalhesMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesMatriculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
