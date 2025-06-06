using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_sc.Migrations
{
    /// <inheritdoc />
    public partial class TabelaAluno_Campo_CategoriaCNH_para_Observacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoriaCnh",
                table: "Alunos");

            migrationBuilder.AddColumn<string>(
                name: "Observacao",
                table: "Alunos",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Observacao",
                table: "Alunos");

            migrationBuilder.AddColumn<string>(
                name: "CategoriaCnh",
                table: "Alunos",
                type: "varchar(22)",
                maxLength: 22,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
