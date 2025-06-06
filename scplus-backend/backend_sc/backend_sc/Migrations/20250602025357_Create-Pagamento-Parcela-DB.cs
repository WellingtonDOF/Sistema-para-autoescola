using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_sc.Migrations
{
    /// <inheritdoc />
    public partial class CreatePagamentoParcelaDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pagamentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ValorTotal = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    DataPagamento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    StatusPagamento = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FormaPagamento = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Descricao = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AlunoId = table.Column<int>(type: "int", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pagamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pagamentos_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Parcelas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NumeroParcela = table.Column<int>(type: "int", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    StatusParcela = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataVencimento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataPagamento = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ValorPago = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    Juros = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    Multa = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    Observacao = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PagamentoId = table.Column<int>(type: "int", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parcelas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Parcelas_Pagamentos_PagamentoId",
                        column: x => x.PagamentoId,
                        principalTable: "Pagamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Permissoes",
                keyColumn: "Id",
                keyValue: 1,
                column: "TipoPermissao",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Permissoes",
                keyColumn: "Id",
                keyValue: 2,
                column: "TipoPermissao",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Permissoes",
                keyColumn: "Id",
                keyValue: 3,
                column: "TipoPermissao",
                value: 3);

            migrationBuilder.UpdateData(
                table: "Pessoas",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DataNascimento", "PermissaoId", "Senha" },
                values: new object[] { new DateTime(2025, 6, 1, 23, 53, 56, 917, DateTimeKind.Local).AddTicks(2166), 3, "$2a$11$i5dEU1Pg2Wc9oGDWf1kSOuUbxGwpfzrT.t2BpXNYe3RUU10wbRFJO" });

            migrationBuilder.CreateIndex(
                name: "IX_Pagamentos_AlunoId",
                table: "Pagamentos",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_Parcelas_PagamentoId",
                table: "Parcelas",
                column: "PagamentoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Parcelas");

            migrationBuilder.DropTable(
                name: "Pagamentos");

            migrationBuilder.UpdateData(
                table: "Permissoes",
                keyColumn: "Id",
                keyValue: 1,
                column: "TipoPermissao",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Permissoes",
                keyColumn: "Id",
                keyValue: 2,
                column: "TipoPermissao",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Permissoes",
                keyColumn: "Id",
                keyValue: 3,
                column: "TipoPermissao",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Pessoas",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DataNascimento", "PermissaoId", "Senha" },
                values: new object[] { new DateTime(2025, 5, 31, 2, 34, 28, 829, DateTimeKind.Local).AddTicks(3736), 2, "$2a$11$YMVdH4u5Cf4Y/5pCED0WqOFVLjTRFO5kQclCCabslqDLN.hlym/ZS" });
        }
    }
}
