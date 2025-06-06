using AutoMapper;
using backend_sc.Enums;

namespace backend_sc.Mapping
{
    public class PermissaoIdParaTipoConverter : IValueConverter<int, string>
    {
        public string Convert(int sourceMember, ResolutionContext context)
        {
            if (Enum.IsDefined(typeof(TipoPermissaoEnum), sourceMember))
            {
                return ((TipoPermissaoEnum)sourceMember).ToString();
            }
            return "Desconhecido"; 
        }
    }  
}