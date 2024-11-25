using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenRoom.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class StripeIdAddedToSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StripeProductId",
                table: "Subscriptions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StripeProductId",
                table: "Subscriptions");
        }
    }
}
