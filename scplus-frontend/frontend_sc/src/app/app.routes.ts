import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { EditarComponent } from './pages/editar/editar.component';
import { DetalhesComponent } from './pages/detalhes/detalhes.component';
import { InstrutorComponent } from './pages/instrutor/instrutor.component';
import { AulaComponent } from './pages/aula/aula/aula.component';
import { DetalhesAulaComponent } from './pages/detalhes/detalhes-aula/detalhes-aula.component';
import { EditarAulaComponent } from './pages/editar/editar-aula/editar-aula.component';
import { MatriculaComponent } from './pages/matricula/matricula.component';
import { CadastroMatriculaComponent } from './pages/cadastro/cadastro-matricula/cadastro-matricula.component';
import { DetalhesMatriculaComponent } from './pages/detalhes/detalhes-matricula/detalhes-matricula.component';
import { EditarMatriculaComponent } from './pages/editar/editar-matricula/editar-matricula.component';
import { VeiculoComponent } from './pages/veiculo/veiculo/veiculo.component';
import { CadastroVeiculoComponent } from './pages/cadastro/cadastro-veiculo/cadastro-veiculo.component';
import { DetalhesVeiculoComponent } from './pages/detalhes/detalhes-veiculo/detalhes-veiculo.component';
import { EditarVeiculoComponent } from './pages/editar/editar-veiculo/editar-veiculo.component';
import { PagamentoComponent } from './pages/pagamento/pagamento.component';
import { CadastroPagamentoComponent } from './pages/cadastro/cadastro-pagamento/cadastro-pagamento.component';
import { DetalhesPagamentoComponent } from './pages/detalhes/detalhes-pagamento/detalhes-pagamento.component';
import { EditarPagamentoComponent } from './pages/editar/editar-pagamento/editar-pagamento.component';
import { ParcelaComponent } from './pages/parcela/parcela.component';
import { DetalhesParcelaComponent } from './pages/detalhes/detalhes-parcela/detalhes-parcela.component';
import { EditarParcelaComponent } from './pages/editar/editar-parcela/editar-parcela.component';
import { authGuard } from './guards/auth.guard';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

    //REDIRECIONAMENTO PADRÃO SEMPRE QUE APLICATIVO FOR INICIADO
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    //PARTE DE LOGIN
    { path: 'login', component: LoginFormComponent },
    //parte de aluno
    { path: 'aluno', component: HomeComponent,canActivate: [authGuard] },
    //parte de aluno e instrutor
    { path : "instrutor", component: InstrutorComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "cadastro", component: CadastroComponent,canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } }, // Apenas Admin pode cadastrar
    { path: "editar/:id", component: EditarComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin, Instrutor'] } },
    { path: "detalhes/:id", component: DetalhesComponent, canActivate: [authGuard, roleGuard], data: { roles: [''] } },
    //parte de aula
    { path: "aula", component: AulaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "detalhesaula/:id", component: DetalhesAulaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "editaraula/:id", component: EditarAulaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    //parte de matrícula
    { path: "matricula", component: MatriculaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin', 'Instrutor'] } },
    { path: "cadastro-matricula", component: CadastroMatriculaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } }, // Apenas Admin pode cadastrar matrícula
    { path: "detalhesmatricula/:id", component: DetalhesMatriculaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "editarmatricula/:id", component: EditarMatriculaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    //parte de veículo
    { path: "veiculo", component: VeiculoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "cadastro-veiculo", component: CadastroVeiculoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } }, // Apenas Admin pode cadastrar veículo
    { path: "detalhesveiculo/:id", component: DetalhesVeiculoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "editarveiculo/:id", component: EditarVeiculoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    //parte de pagamento
    { path: "pagamento", component: PagamentoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "cadastro-pagamento", component: CadastroPagamentoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } }, // Apenas Admin pode cadastrar pagamento
    { path: "detalhes-pagamento/:id", component: DetalhesPagamentoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "editar-pagamento/:id", component: EditarPagamentoComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    //parte de parcela
    { path: "parcela", component: ParcelaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "detalhes-parcela/:id", component: DetalhesParcelaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
    { path: "editar-parcela/:id", component: EditarParcelaComponent, canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },

    // Redirecionamento padrão caso não ache
    { path: '**', redirectTo: 'login' } 
];