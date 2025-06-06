import { PessoaCreateDTO } from "../pessoa/PessoaCreateDTO";

export interface InstrutorCreateDTO extends PessoaCreateDTO{
    categoriaCnh: string;
    dataAdmissao: Date; // ou date
}