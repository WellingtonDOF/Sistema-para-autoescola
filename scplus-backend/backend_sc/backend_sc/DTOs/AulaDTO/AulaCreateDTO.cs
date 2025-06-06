using backend_sc.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.AulaDTO
{
    public class AulaCreateDTO
    {
        [Required]
        [MaxLength(50)]
        public int TipoAula { get; set; }

        [Required]
        [MaxLength(250)]
        public string Descricao { get; set; }
    }
}
