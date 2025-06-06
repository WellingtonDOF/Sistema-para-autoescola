using System.ComponentModel;

namespace backend_sc.Enums
{
    public enum TipoAulaEnum
    {
        Simulado,
        [Description("Prática")]  //Texto com acento
        Pratica,
        [Description("Teórica")]  //Texto com acento
        Teorica,
        Prova
    }
}
