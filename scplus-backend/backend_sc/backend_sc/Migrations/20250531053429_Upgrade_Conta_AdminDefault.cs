using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_sc.Migrations
{
    /// <inheritdoc />
    public partial class Upgrade_Conta_AdminDefault : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Pessoas",
                columns: new[] { "Id", "Cpf", "DataNascimento", "Email", "Endereco", "NomeCompleto", "PermissaoId", "Senha", "Status", "Telefone" },
                values: new object[] { 1, "00000000000", new DateTime(2025, 5, 31, 2, 34, 28, 829, DateTimeKind.Local).AddTicks(3736), "Default@sistema.com", "RuaDefault", "AdminDefault", 2, "$2a$11$YMVdH4u5Cf4Y/5pCED0WqOFVLjTRFO5kQclCCabslqDLN.hlym/ZS", true, "0000000000" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Pessoas",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
