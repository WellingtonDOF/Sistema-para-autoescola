export interface Response<T> {
    dados: T | null;
    mensagem: string;
    sucesso: boolean;
}