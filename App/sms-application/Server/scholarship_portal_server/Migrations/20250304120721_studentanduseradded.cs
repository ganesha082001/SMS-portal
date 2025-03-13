using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace scholarship_portal_server.Migrations
{
    /// <inheritdoc />
    public partial class studentanduseradded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DropdownGroups",
                columns: table => new
                {
                    DropdownGroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DropdownGroupName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropdownGroupCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DropdownGroups", x => x.DropdownGroupId);
                });

            migrationBuilder.CreateTable(
                name: "Staffs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    staffName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    staffId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    staffPrivilageId = table.Column<int>(type: "int", nullable: false),
                    StaffPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StaffUsername = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StaffPassword = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staffs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentRollnumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    studentusername = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    studentpassword = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentId);
                });

            migrationBuilder.CreateTable(
                name: "DropdownValues",
                columns: table => new
                {
                    DropdownValueId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DropdownValueName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DropdownGroupCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropdownGroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DropdownValues", x => x.DropdownValueId);
                    table.ForeignKey(
                        name: "FK_DropdownValues_DropdownGroups_DropdownGroupId",
                        column: x => x.DropdownGroupId,
                        principalTable: "DropdownGroups",
                        principalColumn: "DropdownGroupId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DropdownValues_DropdownGroupId",
                table: "DropdownValues",
                column: "DropdownGroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DropdownValues");

            migrationBuilder.DropTable(
                name: "Staffs");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "DropdownGroups");
        }
    }
}
