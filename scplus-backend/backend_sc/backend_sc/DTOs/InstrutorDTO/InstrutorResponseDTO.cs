using backend_sc.DTOs.PessoaDTO;
using System.Text.Json.Serialization;

namespace backend_sc.DTOs.InstrutorDTO
{
    public class InstrutorResponseDTO : PessoaResponseDTO
    {
        [JsonPropertyOrder(1)]
        public string CategoriaCnh { get; set; }

        [JsonPropertyOrder(1)]
        public DateTime DataAdmissao { get; set; }
    }
}
