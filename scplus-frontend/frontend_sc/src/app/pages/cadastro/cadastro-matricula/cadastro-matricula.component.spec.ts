import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMatriculaComponent } from './cadastro-matricula.component';

describe('CadastroMatriculaComponent', () => {
  let component: CadastroMatriculaComponent;
  let fixture: ComponentFixture<CadastroMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMatriculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
