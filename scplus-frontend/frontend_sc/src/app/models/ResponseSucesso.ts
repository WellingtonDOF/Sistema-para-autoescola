// response-erro.model.ts
import { Response } from './Response';

export class ResponseSucesso<T> implements Response<T> {
  sucesso: boolean = true;
  mensagem: string = '';
  dados: T; // 'dados' também pode ser genérico e potencialmente null

  constructor(dados: T, mensagem: string, ) {
    this.mensagem = mensagem || 'Sucesso.';
    this.dados = dados;
  }
}