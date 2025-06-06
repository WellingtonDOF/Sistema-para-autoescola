import { PessoaUpdateDTO } from "../pessoa/PessoaUpdateDTO";

export interface InstrutorUpdateDTO extends PessoaUpdateDTO{
    categoriaCnh: string;
}