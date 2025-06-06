import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule, 
    MatListModule,
    MatExpansionModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  @ViewChild('drawer') drawer!: MatSidenav;
  
  isHandset = false;
  showHeaderFooter = true; // Será definido no construtor
  submenuStates: { [key: string]: boolean } = {
    'instrutor': false,
    'aluno': false,
    'aula': false,
    'veiculo': false,
    'matricula': false,
    'pagamento': false,  // Novo
    'parcela': false     // Novo
  };
  
  // VARIÁVEIS PARA CONTROLE DE USUÁRIO E ROLE
  userRole: 'Admin' | 'Instrutor' | 'Aluno' | null = null;
  currentUser: any = null;
  isAdmin = false;
  isInstrutor = false;
  isAluno = false;

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private router: Router,
    private authService: AuthService
  ) {
    this.isHandset = this.breakpointObserver.isMatched('(max-width: 768px)');
    
    // VERIFICA A ROTA ATUAL NO CONSTRUTOR PARA EVITAR O PROBLEMA
    this.checkCurrentRoute();
  }

  ngOnInit() {
    // Escuta mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateHeaderFooterVisibility(event.url);
      });

    // CARREGA DADOS DO USUÁRIO INICIAL
    this.loadUserData();
    
    // ESCUTA MUDANÇAS NO USUÁRIO LOGADO
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadUserData();
    });
  }

  // MÉTODO PARA VERIFICAR A ROTA ATUAL NO CONSTRUTOR
  private checkCurrentRoute() {
    const currentUrl = this.router.url;
    this.updateHeaderFooterVisibility(currentUrl);
  }

  // MÉTODO SEPARADO PARA ATUALIZAR A VISIBILIDADE DO HEADER/FOOTER
  private updateHeaderFooterVisibility(url: string) {
    const hideHeaderFooterRoutes = ['/login', '/'];
    this.showHeaderFooter = !hideHeaderFooterRoutes.includes(url);
  }

  // MÉTODO PARA CARREGAR DADOS DO USUÁRIO
  private loadUserData() {
    this.userRole = this.authService.getUserType();
    this.currentUser = this.authService.getCurrentUser();
    
    // Define variáveis booleanas para facilitar o uso no template
    this.isAdmin = this.userRole === 'Admin';
    this.isInstrutor = this.userRole === 'Instrutor';
    this.isAluno = this.userRole === 'Aluno';
  }

  // MÉTODO PARA VERIFICAR SE O USUÁRIO TEM PERMISSÃO
  hasPermission(requiredRole: 'Admin' | 'Instrutor' | 'Aluno'): boolean {
    return this.authService.hasPermission(requiredRole);
  }

  // MÉTODO PARA VERIFICAR SE PODE ACESSAR UMA ROTA
  canAccessRoute(route: string): boolean {
    return this.authService.canAccessRoute(route);
  }

  toggleSubmenu(menu: string) {
    this.submenuStates[menu] = !this.submenuStates[menu];
  }

  logout() {
    console.log('Usuário deslogado');
    this.authService.logout();
  }

  // GETTER PARA FILTRAR MENU ITEMS BASEADO NA ROLE
  get filteredMenuItems() {
    return this.menuItems.filter(item => {
      // Usa o método canAccessRoute do seu AuthService para cada item
      if (item.route) {
        return this.canAccessRoute(item.route);
      }
      
      // Para itens com subitens, verifica se pelo menos um subitem é acessível
      if (item.subItems) {
        return item.subItems.some((subItem: any) => this.canAccessRoute(subItem.route));
      }
      
      return true;
    });
  }

  menuItems = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      title: 'Instrutores',
      icon: 'school',
      expanded: false,
      route: '/instrutor',
      subItems: [
        { title: 'Listar Instrutores', route: '/instrutor' },
        { title: 'Cadastrar Instrutor', route: '/instrutor/cadastrar' }
      ]
    },
    {
      title: 'Alunos',
      icon: 'person',
      expanded: false,
      route: '/aluno',
      subItems: [
        { title: 'Listar Alunos', route: '/aluno' },
        { title: 'Cadastrar Aluno', route: '/aluno/cadastrar' }
      ]
    },
    {
      title: 'Aulas',
      icon: 'event',
      expanded: false,
      route: '/aula',
      subItems: [
        { title: 'Listar Aulas', route: '/aula' },
        { title: 'Cadastrar Aula', route: '/aula/cadastrar' }
      ]
    },
    {
      title: 'Veículos',
      icon: 'directions_car',
      expanded: false,
      route: '/veiculo',
      subItems: [
        { title: 'Listar Veículos', route: '/veiculo' },
        { title: 'Cadastrar Veículo', route: '/veiculo/cadastrar' }
      ]
    },
    {
      title: 'Matrículas',
      icon: 'assignment',
      expanded: false,
      route: '/matricula',
      subItems: [
        { title: 'Listar Matrículas', route: '/matricula' },
        { title: 'Cadastrar Matrícula', route: '/matricula/cadastrar' }
      ]
    },
    {
      title: 'Pagamentos',
      icon: 'payment',
      expanded: false,
      route: '/pagamento',
      subItems: [
        { title: 'Listar Pagamentos', route: '/pagamento' },
        { title: 'Novo Pagamento', route: '/cadastro-pagamento' },
        { title: 'Pagamentos Vencidos', route: '/pagamento', queryParams: { filter: 'vencidos' } }
      ]
    },
    {
      title: 'Parcelas',
      icon: 'receipt',
      expanded: false,
      route: '/parcela',
      subItems: [
        { title: 'Listar Parcelas', route: '/parcela' },
        { title: 'Parcelas Vencidas', route: '/parcela', queryParams: { filter: 'vencidas' } },
        { title: 'Vencendo em 7 dias', route: '/parcela', queryParams: { filter: 'vencendo', dias: '7' } },
        { title: 'Vencendo em 30 dias', route: '/parcela', queryParams: { filter: 'vencendo', dias: '30' } }
      ]
    }
  ];

  toggleDrawer() {
    this.drawer.toggle();
  }

  toggleExpansion(item: any) {
    if (item.subItems) {
      item.expanded = !item.expanded;
    }
  }

  closeDrawerOnMobile() {
    if (this.isHandset) {
      this.drawer.close();
    }
  }
}