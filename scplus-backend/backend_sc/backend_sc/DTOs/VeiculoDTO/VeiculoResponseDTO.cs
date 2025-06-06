using backend_sc.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend_sc.DTOs.VeiculoDTO
{
    public class VeiculoResponseDTO
    {
        public int Id { get; set; }
        public string Placa { get; set; }
        public string Modelo { get; set; }
        public string Marca { get; set; }
        public DateTime DataFabricacao { get; set; }
        public string Categoria { get; set; }
        public DateTime DataAquisicao { get; set; }
        public string StatusVeiculo { get; set; }
    }
}
