using System.ComponentModel.DataAnnotations;

namespace scholarship_portal_server.Models
{
    public class ScholarshipInfo
    {
        [Key]
        public Guid ScholarshipInfoID { get; set; }
        public bool IsParentDivorced { get; set; }
        public string DivorcedProofFilePath { get; set; }
        public bool IsParentPhysicallyDisabled { get; set; }
        public string ParentPhysicallyDisabledFilePath { get; set; }
        public bool IsReceivedAnyScholarship { get; set; }
        public string ScholarshipName { get; set; }
        public decimal ScholarshipAmountReceived { get; set; }
        public string SiblingsDetails { get; set; }
        public Guid StudentID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }

}
