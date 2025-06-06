using backend_sc.DTOs.PessoaDTO;
using System.Text.Json.Serialization;

namespace backend_sc.DTOs.AlunoDTO
{
    public class AlunoResponseDTO : PessoaResponseDTO
    {
        //Só coloquei isso de json para esses 3 campos ficarem por ultimo no retorno da resposta json

        [JsonPropertyOrder(1)]
        public string Observacao { get; set; }

        [JsonPropertyOrder(1)]
        public string StatusPagamento { get; set; }

        [JsonPropertyOrder(1)]
        public string StatusCurso { get; set; }
    }
}
