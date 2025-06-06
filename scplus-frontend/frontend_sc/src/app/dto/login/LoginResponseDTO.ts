export interface LoginResponse {
    dados: {
        id: number;
        token: string;
        nomeCompleto: string;
        email: string;
        tipoUsuario: 'Admin' | 'Instrutor' | 'Aluno';
    };
    mensagem: string;
    sucesso: boolean;
}