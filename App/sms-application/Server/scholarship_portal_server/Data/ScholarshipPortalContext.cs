using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace scholarship_portal_server.Models
{
    public class ScholarshipPortalContext : DbContext
    {
        public ScholarshipPortalContext(DbContextOptions<ScholarshipPortalContext> options)
            : base(options)
        {
        }

        public DbSet<DropdownGroup> DropdownGroups { get; set; }
        public DbSet<DropdownValue> DropdownValues { get; set; }

        public DbSet<Scholarship> Scholarships { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Staff> Staffs { get; set; }

    }
}
