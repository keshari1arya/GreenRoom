using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenRoom.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class PaymentDetailsTableAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "TenantSubscriptions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "StripeProductId",
                table: "Subscriptions",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ApplicationConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationConfigurations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentIntentId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethodId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethodType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentAmount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentCurrency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentReceiptUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentFailureCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentFailureMessage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundAmount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundCurrency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureMessage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundReceiptUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureBalanceTransaction = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailurePaymentIntent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureCharge = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureCodeCharge = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureCodePaymentIntent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureCodeReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentRefundFailureCodeType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TenantSubscriptions_PaymentId",
                table: "TenantSubscriptions",
                column: "PaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_StripeProductId",
                table: "Subscriptions",
                column: "StripeProductId",
                unique: true,
                filter: "[StripeProductId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_TenantSubscriptions_Payments_PaymentId",
                table: "TenantSubscriptions",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_Payments_PaymentId",
                table: "TenantSubscriptions");

            migrationBuilder.DropTable(
                name: "ApplicationConfigurations");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_TenantSubscriptions_PaymentId",
                table: "TenantSubscriptions");

            migrationBuilder.DropIndex(
                name: "IX_Subscriptions_StripeProductId",
                table: "Subscriptions");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "TenantSubscriptions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StripeProductId",
                table: "Subscriptions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
