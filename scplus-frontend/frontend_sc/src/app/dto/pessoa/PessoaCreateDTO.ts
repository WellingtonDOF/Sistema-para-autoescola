export interface PessoaCreateDTO {
    nomeCompleto: string; 
    cpf: string;         
    endereco: string;     
    telefone: string;    
    email: string;        
    dataNascimento: Date; // ou date
    tipoUsuario: string;  
    senha: string;    
}