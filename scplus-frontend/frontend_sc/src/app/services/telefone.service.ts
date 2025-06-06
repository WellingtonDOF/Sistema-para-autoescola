import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {

  formatarTelefone(telefone: string): string {
    if (!telefone) {
      return '';
    }

    const cleaned = ('' + telefone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return telefone; // Retorna o valor original se não corresponder ao padrão
  }
}