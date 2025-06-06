// response-erro.model.ts
import { Response } from './Response';

export class ResponseErro<T> implements Response<T> {
  sucesso: boolean = false;
  mensagem: string = '';
  dados: T | null; // 'dados' também pode ser genérico e potencialmente null

  constructor(dados: T | null, mensagem: string, ) {
    this.mensagem = mensagem || 'Erro.';
    this.dados = dados;
  }
}