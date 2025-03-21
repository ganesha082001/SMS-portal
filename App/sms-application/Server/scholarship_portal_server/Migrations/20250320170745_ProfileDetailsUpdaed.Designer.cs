﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using scholarship_portal_server.Models;

#nullable disable

namespace scholarship_portal_server.Migrations
{
    [DbContext(typeof(ScholarshipPortalContext))]
    [Migration("20250320170745_ProfileDetailsUpdaed")]
    partial class ProfileDetailsUpdaed
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("scholarship_portal_server.Models.DropdownGroup", b =>
                {
                    b.Property<Guid>("DropdownGroupId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("DropdownGroupCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DropdownGroupName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("DropdownGroupId");

                    b.ToTable("DropdownGroups");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.DropdownValue", b =>
                {
                    b.Property<Guid>("DropdownValueId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("DropdownGroupCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("DropdownGroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("DropdownValueName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("DropdownValueId");

                    b.HasIndex("DropdownGroupId");

                    b.ToTable("DropdownValues");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.EducationalInfo", b =>
                {
                    b.Property<Guid>("EducationalId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Batch")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CourseType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("CurrentYear")
                        .HasColumnType("int");

                    b.Property<string>("FirstGraduateFilePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<bool>("IsFirstGraduate")
                        .HasColumnType("bit");

                    b.Property<bool>("IsHosteler")
                        .HasColumnType("bit");

                    b.Property<string>("SchoolType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Section")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Shift")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("StartYear")
                        .HasColumnType("int");

                    b.Property<Guid>("StudentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("UMIStudentNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("EducationalId");

                    b.ToTable("EducationalInfo");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.PersonalInfo", b =>
                {
                    b.Property<Guid>("PersonalId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AadharMobileNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AadharNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Community")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CommunityCertificatePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("HasCommunityCertificate")
                        .HasColumnType("bit");

                    b.Property<bool>("HasIncomeCertificate")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("IncomeCertificateIssuedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("IncomeCertificatePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<bool>("IsDonePartTime")
                        .HasColumnType("bit");

                    b.Property<string>("PartTimeProofFilePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("StudentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("PersonalId");

                    b.ToTable("PersonalInfo");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.Scholarship", b =>
                {
                    b.Property<Guid>("ScholarshipId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("ApplicationEndDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ApplicationStartDate")
                        .HasColumnType("datetime2");

                    b.Property<bool>("CanNotify")
                        .HasColumnType("bit");

                    b.Property<Guid>("ContactStaffId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("EligibilityCriteria")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<bool>("IsSelfEnrollable")
                        .HasColumnType("bit");

                    b.Property<string>("ScholarshipDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ScholarshipTitle")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ScholarshipType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SelfEnrollUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("ScholarshipId");

                    b.HasIndex("ContactStaffId");

                    b.ToTable("Scholarships");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.ScholarshipInfo", b =>
                {
                    b.Property<Guid>("ScholarshipInfoID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("DivorcedProofFilePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<bool>("IsParentDivorced")
                        .HasColumnType("bit");

                    b.Property<bool>("IsParentPhysicallyDisabled")
                        .HasColumnType("bit");

                    b.Property<bool>("IsReceivedAnyScholarship")
                        .HasColumnType("bit");

                    b.Property<string>("ParentPhysicallyDisabledFilePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("ScholarshipAmountReceived")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("ScholarshipName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SiblingsDetails")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("StudentID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("ScholarshipInfoID");

                    b.ToTable("ScholarshipsInfo");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.Staff", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("StaffPassword")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("StaffPhone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("StaffUsername")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("staffId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("staffName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("staffPrivilageId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Staffs");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.Student", b =>
                {
                    b.Property<Guid>("StudentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("StudentEmail")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("StudentName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("StudentPhone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("StudentRollnumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("studentpassword")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("studentusername")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("StudentId");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.DropdownValue", b =>
                {
                    b.HasOne("scholarship_portal_server.Models.DropdownGroup", null)
                        .WithMany("DropdownValues")
                        .HasForeignKey("DropdownGroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("scholarship_portal_server.Models.Scholarship", b =>
                {
                    b.HasOne("scholarship_portal_server.Models.Staff", "ContactStaff")
                        .WithMany()
                        .HasForeignKey("ContactStaffId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ContactStaff");
                });

            modelBuilder.Entity("scholarship_portal_server.Models.DropdownGroup", b =>
                {
                    b.Navigation("DropdownValues");
                });
#pragma warning restore 612, 618
        }
    }
}
