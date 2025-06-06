using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_sc.Migrations
{
    /// <inheritdoc />
    public partial class UpdateParcelaModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Observacao",
                table: "Parcelas",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Pessoas",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DataNascimento", "Senha" },
                values: new object[] { new DateTime(2025, 6, 2, 1, 24, 48, 978, DateTimeKind.Local).AddTicks(7460), "$2a$11$dzI1B6o38KLsn62Qn3X7JO9sBLzXpDI2b11EPQPTaq.WXIKT13l9O" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Parcelas",
                keyColumn: "Observacao",
                keyValue: null,
                column: "Observacao",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Observacao",
                table: "Parcelas",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Pessoas",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DataNascimento", "Senha" },
                values: new object[] { new DateTime(2025, 6, 1, 23, 53, 56, 917, DateTimeKind.Local).AddTicks(2166), "$2a$11$i5dEU1Pg2Wc9oGDWf1kSOuUbxGwpfzrT.t2BpXNYe3RUU10wbRFJO" });
        }
    }
}
