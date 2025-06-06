import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarVeiculoComponent } from './editar-veiculo.component';

describe('EditarVeiculoComponent', () => {
  let component: EditarVeiculoComponent;
  let fixture: ComponentFixture<EditarVeiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarVeiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarVeiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
