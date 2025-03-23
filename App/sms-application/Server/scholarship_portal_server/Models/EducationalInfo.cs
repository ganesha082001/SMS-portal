using System.ComponentModel.DataAnnotations;

namespace scholarship_portal_server.Models
{
    public class EducationalInfo
    {
        [Key]
        public Guid EducationalId { get; set; }
        public Guid StudentId { get; set; }
        public string CourseType { get; set; }
        public int StartYear { get; set; }
        public string Batch { get; set; }
        public string Shift { get; set; }
        public bool IsHosteler { get; set; }
        public int CurrentYear { get; set; }
        public string Section { get; set; }
        public bool IsFirstGraduate { get; set; }
        public string FirstGraduateFilePath { get; set; }
        public string SchoolType { get; set; }
        public string UMIStudentNumber { get; set; }
        public string Department { get; set; }
        public decimal PreviousYearMarks { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}
