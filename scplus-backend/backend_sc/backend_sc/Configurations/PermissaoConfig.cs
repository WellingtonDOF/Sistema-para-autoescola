using backend_sc.Enums;
public static class PermissaoConfig
{
    public static Dictionary<TipoPermissaoEnum, int> TipoParaId = new Dictionary<TipoPermissaoEnum, int>()
    {
        { TipoPermissaoEnum.Aluno, 1 }, // Enum 1 -> Id 1 (banco)
        { TipoPermissaoEnum.Instrutor, 2 }, // Enum 2 -> Id 2 (banco)
        { TipoPermissaoEnum.Admin, 3 } // Enum 3 -> Id 3 (banco)
    };
}