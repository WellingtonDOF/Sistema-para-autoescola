export interface MatriculaViewModel{
    id: number;
    alunoId: number; 
    quantidadeAulaTotal: number;         
    dataInicio: string;     
    dataFim: string;    
    categoriaPlano: string;        
    statusMatricula: string;
    alunoCpf?: string; // Adicione a propriedade para o CPF
    alunoNome?: string;
    alunoTelefone?: string
}