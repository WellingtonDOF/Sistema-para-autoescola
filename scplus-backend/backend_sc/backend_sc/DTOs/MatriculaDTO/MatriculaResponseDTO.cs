using backend_sc.Enums;
using backend_sc.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.MatriculaDTO
{
    public class MatriculaResponseDTO
    {
        public int Id { get; set; }
        public int AlunoId { get; set; }
        public int QuantidadeAulaTotal { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string CategoriaPlano { get; set; }
        public string StatusMatricula { get; set; }
        public string AlunoCpf { get; set; }
        public string AlunoNome { get; set; }
        public string AlunoTelefone { get; set; }


    }
}
