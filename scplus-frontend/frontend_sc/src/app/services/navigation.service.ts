import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousPageSource = new BehaviorSubject<string | null>(null);
  previousPage$ = this.previousPageSource.asObservable();

  constructor(private router: Router) {}

  setPreviousPage(page: string): void {
    this.previousPageSource.next(page);
  }

  getPreviousPage(): string | null {
    return this.previousPageSource.value;
  }

  navigateToCadastro(tipo: 'instrutor' | 'aluno' | 'aula' | 'veiculo' | 'matricula'): void {
    this.router.navigate([`/${tipo}/cadastrar`]);
  }

  // Navegação para listagens
  navigateToList(tipo: 'instrutor' | 'aluno' | 'aula' | 'veiculo' | 'matricula'): void {
    this.router.navigate([`/${tipo}`]);
  }

  // Navegação para edição
  navigateToEdit(tipo: 'instrutor' | 'aluno' | 'aula' | 'veiculo' | 'matricula', id: number): void {
    this.router.navigate([`/${tipo}/editar`, id]);
  }

  // Navegação para detalhes
  navigateToDetails(tipo: 'instrutor' | 'aluno' | 'aula' | 'veiculo' | 'matricula', id: number): void {
    this.router.navigate([`/${tipo}/detalhes`, id]);
  }
}