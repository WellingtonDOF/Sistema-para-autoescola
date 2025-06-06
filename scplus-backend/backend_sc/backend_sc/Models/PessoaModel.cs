using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_sc.Models
{
    public class PessoaModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string NomeCompleto { get; set; }

        [Required]
        [MaxLength(16)] 
        public string Cpf { get; set; }

        [Required]
        [MaxLength (150)]
        public string Endereco { get; set; }

        [Required]
        [Phone]
        [MaxLength(22)]
        public string Telefone { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; }

        [Required]
        public DateTime DataNascimento { get; set; }

        [Required]
        [ForeignKey("Permissao")]
        public int PermissaoId{ get; set; }

        [Required]
        public bool Status { get; set; }

        [Required]
        public string Senha { get; set; }

        //Propriedade de navegação para a entidade permissão (traz eficiência) 
        public PermissaoModel Permissao { get; set; }
    }
}
