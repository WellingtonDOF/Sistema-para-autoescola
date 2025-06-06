using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.AulaDTO
{
    public class AulaUpdateDTO
    {
        [Required]
        [MaxLength(250)]
        public string Descricao { get; set; }
    }
}
