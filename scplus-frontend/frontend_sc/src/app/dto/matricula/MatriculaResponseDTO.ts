export interface MatriculaResponseDTO {
    id: number;
    alunoId: number; 
    quantidadeAulaTotal: number;         
    dataInicio: string;     
    dataFim: string;    
    categoriaPlano: string;        
    statusMatricula: string;
    alunoCpf: string
    alunoNome: string
    alunoTelefone: string
}
