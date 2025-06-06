import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPagamentoComponent } from './editar-pagamento.component';

describe('EditarPagamentoComponent', () => {
  let component: EditarPagamentoComponent;
  let fixture: ComponentFixture<EditarPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
