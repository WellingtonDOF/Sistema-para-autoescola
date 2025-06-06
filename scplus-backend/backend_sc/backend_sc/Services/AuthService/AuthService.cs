using AutoMapper;
using backend_sc.DataContext;
using backend_sc.DTOs.InstrutorDTO;
using backend_sc.DTOs.LoginDTO;
using backend_sc.DTOs.MatriculaDTO;
using backend_sc.Mapping;
using backend_sc.Models;
using backend_sc.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend_sc.Services.AuthService
{
    public class AuthService : IAuthInterface
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IMapper _mapper;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, IMapper mapper, IPasswordHasher passwordHasher)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<LoginResponseDTO>> LoginAsync(LoginDTO loginDto)
        {
            var serviceResponse = new ServiceResponse<LoginResponseDTO>();

            //var cpfLimpo = loginDto.Cpf.Replace(".", "").Replace("-", "");

            try
            {
                if (loginDto.Cpf == null || loginDto.Senha == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Dados inválidos";
                    return serviceResponse;
                }

                var usuario = await _context.Pessoas.FirstOrDefaultAsync(u => u.Cpf == loginDto.Cpf && u.Status == true);

                if (usuario == null)
                {

                    serviceResponse.Sucesso = false;
                    serviceResponse.Mensagem = "Erro ao logar, CPF inválido ou usuário desabilitado";
                    return serviceResponse;
                }

                if (!VerificarSenha(loginDto.Senha, usuario.Senha))
                {
                    throw new UnauthorizedAccessException("CPF ou senha inválidos");
                }

                var token = GerarToken(usuario);

                var login = _mapper.Map<LoginResponseDTO>(usuario);

                login.Token = token;

                serviceResponse.Dados = login;
                serviceResponse.Mensagem = "Logado com sucesso!";
            }
            catch (Exception ex)
            {
                serviceResponse.Sucesso = false;
                serviceResponse.Mensagem = ex.Message;
            }

            return serviceResponse;
        }

        public string GerarToken(PessoaModel usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var permissaoConverter = new PermissaoIdParaTipoConverter();
            var roleString = permissaoConverter.Convert(usuario.PermissaoId, null);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.NomeCompleto),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim("cpf", usuario.Cpf),
                new Claim(ClaimTypes.Role, roleString)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8), // Token válido por 8 horas
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool VerificarSenha(string senha, string hash)
        {
            return _passwordHasher.Verify(senha, hash);
        }
    }
}
