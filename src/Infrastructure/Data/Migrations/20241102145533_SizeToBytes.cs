using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenRoom.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SizeToBytes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizeInKB",
                table: "Assets");

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "Assets",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "Assets");

            migrationBuilder.AddColumn<int>(
                name: "SizeInKB",
                table: "Assets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
