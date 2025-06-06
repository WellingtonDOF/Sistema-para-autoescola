using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using backend_sc.Enums;

namespace backend_sc.Models
{
    public class VeiculoModel 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Placa { get; set; }

        [Required]
        [MaxLength(150)]
        public string Modelo { get; set; }

        [Required]
        [MaxLength(150)]
        public string Marca { get; set; }

        [Required]
        public DateTime DataFabricacao { get; set; }

        [Required]
        public VeiculoCategoriaEnum Categoria { get; set; }

        [Required]
        public DateTime DataAquisicao { get; set; }

        [Required]
        public bool StatusVeiculo { get; set; }
    }
}
