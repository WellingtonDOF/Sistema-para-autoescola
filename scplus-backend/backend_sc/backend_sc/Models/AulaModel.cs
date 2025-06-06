using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using backend_sc.Enums;

namespace backend_sc.Models
{
    public class AulaModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public TipoAulaEnum TipoAula { get; set; }

        [Required]
        [MaxLength(150)]
        public string Descricao { get; set; }
    }
}
