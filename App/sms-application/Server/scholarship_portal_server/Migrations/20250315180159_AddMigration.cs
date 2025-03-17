using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace scholarship_portal_server.Migrations
{
    /// <inheritdoc />
    public partial class AddMigration : Migration
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

            migrationBuilder.CreateTable(
                name: "Scholarships",
                columns: table => new
                {
                    ScholarshipId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ScholarshipTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScholarshipDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EligibilityCriteria = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApplicationStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApplicationEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScholarshipType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CanNotify = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSelfEnrollable = table.Column<bool>(type: "bit", nullable: false),
                    SelfEnrollUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scholarships", x => x.ScholarshipId);
                    table.ForeignKey(
                        name: "FK_Scholarships_Staffs_ContactStaffId",
                        column: x => x.ContactStaffId,
                        principalTable: "Staffs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DropdownValues_DropdownGroupId",
                table: "DropdownValues",
                column: "DropdownGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Scholarships_ContactStaffId",
                table: "Scholarships",
                column: "ContactStaffId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DropdownValues");

            migrationBuilder.DropTable(
                name: "Scholarships");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "DropdownGroups");

            migrationBuilder.DropTable(
                name: "Staffs");
        }
    }
}
