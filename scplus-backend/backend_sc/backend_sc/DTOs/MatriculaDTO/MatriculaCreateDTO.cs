using backend_sc.Enums;
using backend_sc.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.MatriculaDTO
{
    public class MatriculaCreateDTO
    {
        [Required]
        public int AlunoId { get; set; }

        [Required]
        public string CategoriaPlano { get; set; }

        [Required]
        public int QuantidadeAulaTotal { get; set; }
    }
}
