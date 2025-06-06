import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoComponent } from './veiculo.component';

describe('VeiculoComponent', () => {
  let component: VeiculoComponent;
  let fixture: ComponentFixture<VeiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
