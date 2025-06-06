import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesPagamentoComponent } from './detalhes-pagamento.component';

describe('DetalhesPagamentoComponent', () => {
  let component: DetalhesPagamentoComponent;
  let fixture: ComponentFixture<DetalhesPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
