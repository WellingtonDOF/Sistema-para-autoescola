using backend_sc.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_sc.Models
{
    public class PermissaoModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        //Utilizando um enum para legibilidade do código e restrição de valores
        [Required]
        public TipoPermissaoEnum TipoPermissao { get; set; }
    }
}
