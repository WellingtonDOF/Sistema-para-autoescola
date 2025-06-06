namespace backend_sc.Configurations
{
    public class LowercaseControllerRoute : IOutboundParameterTransformer
    {
        public string TransformOutbound(object value)
        {
            if (value == null)
            {
                return null;
            }
            return value.ToString().ToLowerInvariant();
        }
    }
}
