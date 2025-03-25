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

        public DbSet<Scholarship> Scholarships { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<PersonalInfo> PersonalInfo { get; set; }
        public DbSet<ScholarshipInfo> ScholarshipsInfo { get; set; }
        public DbSet<EducationalInfo> EducationalInfo { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }
        public DbSet<Notification> Notifications { get; set; }


    }
}
