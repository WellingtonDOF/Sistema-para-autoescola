using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.VeiculoDTO
{
    public class VeiculoUpdateDTO
    {
        [Required]
        [MaxLength(150)]
        public string Modelo { get; set; }

        [Required]
        [MaxLength(150)]
        public string Marca { get; set; }

        [Required]
        public string DataFabricacao { get; set; }

        [Required]
        public string DataAquisicao { get; set; }
    }
}
