using AutoMapper;
using backend_sc.Enums; 

namespace backend_sc.Mapping
{
    public class TipoParaPermissaoIdConverter : IValueConverter<string, int>
    {
        public int Convert(string source, ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source))
            {
                return -1;
            }

            if (Enum.TryParse<TipoPermissaoEnum>(source, true, out var tipoUsuario))
            {
                if (PermissaoConfig.TipoParaId.TryGetValue(tipoUsuario, out var permissaoId))
                {
                    return permissaoId;
                }
            }

            return -1; // Retorna -1 se não encontrar o tipo ou a string for inválida
        }
    }
}