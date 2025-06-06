using backend_sc.Configurations;
using backend_sc.DataContext;
using backend_sc.Security;
using backend_sc.Services.AlunoService;
using backend_sc.Services.AulaService;
using backend_sc.Services.AuthService;
using backend_sc.Services.InstrutorService;
using backend_sc.Services.MatriculaService;
using backend_sc.Services.PagamentoService;
using backend_sc.Services.ParcelaService;
using backend_sc.Services.PessoaService;
using backend_sc.Services.VeiculoService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    //Configurando rotas para minusculas 
    options.Conventions.Add(new RouteTokenTransformerConvention(new LowercaseControllerRoute()));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Interfaces/Services
builder.Services.AddScoped<IPessoaInterface, PessoaService>();
builder.Services.AddScoped<IAlunoInterface, AlunoService>();
builder.Services.AddScoped<IInstrutorInterface, InstrutorService>();
builder.Services.AddScoped<IAulaInterface, AulaService>();
builder.Services.AddScoped<IVeiculoInterface, VeiculoService>();
builder.Services.AddScoped<IMatriculaInterface, MatriculaService>();
builder.Services.AddScoped<IPagamentoInterface, PagamentoService>();
builder.Services.AddScoped<IParcelaInterface, ParcelaService>();

//Security
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

//Login
builder.Services.AddScoped<IAuthInterface, AuthService>();

//JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("InstrutorOrAdmin", policy => policy.RequireRole("Instrutor", "Admin"));
    options.AddPolicy("AlunoOrAbove", policy => policy.RequireRole("Aluno", "Instrutor", "Admin"));
});


//parte do banco de dados
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")));
});

//AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

//CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.Run();
