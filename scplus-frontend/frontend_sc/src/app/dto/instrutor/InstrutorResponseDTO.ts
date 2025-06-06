import { PessoaResponseDTO } from "../pessoa/PessoaResponseDTO";

export interface InstrutorResponseDTO extends PessoaResponseDTO{
    categoriaCnh: string;
    dataAdmissao : string;
}