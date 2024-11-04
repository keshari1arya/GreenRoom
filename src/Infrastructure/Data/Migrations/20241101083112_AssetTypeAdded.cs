using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenRoom.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AssetTypeAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Assets");
        }
    }
}
