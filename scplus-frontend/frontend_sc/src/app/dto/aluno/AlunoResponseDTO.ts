import { PessoaResponseDTO } from "../pessoa/PessoaResponseDTO";

export interface AlunoResponseDTO extends PessoaResponseDTO{
    observacao: string;
    statusPagamento : string;
    statusCurso : string;
}