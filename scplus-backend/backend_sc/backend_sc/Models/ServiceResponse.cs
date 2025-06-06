namespace backend_sc.Models
{
    public class ServiceResponse<T>
    {
        //Recebe qualquer objeto (<T>); retorna o objeto uma mensagem e se teve sucesso
        public T? Dados { get; set; }
        
        //Começa com uma string vazia
        public string Mensagem { get; set; } = string.Empty;

        //Começa como true, indicando sucesso
        public bool Sucesso { get; set; } = true;
    }
}
