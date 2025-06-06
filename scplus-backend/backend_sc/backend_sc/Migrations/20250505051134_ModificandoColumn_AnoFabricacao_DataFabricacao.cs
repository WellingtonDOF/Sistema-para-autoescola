using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_sc.Migrations
{
    /// <inheritdoc />
    public partial class ModificandoColumn_AnoFabricacao_DataFabricacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AnoFabricacao",
                table: "Veiculo",
                newName: "DataFabricacao");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DataFabricacao",
                table: "Veiculo",
                newName: "AnoFabricacao");
        }
    }
}
