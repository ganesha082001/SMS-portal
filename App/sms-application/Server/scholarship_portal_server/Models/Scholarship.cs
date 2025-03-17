using System.Runtime.InteropServices;

namespace scholarship_portal_server.Models
{
    public class Scholarship
    {
        public Guid ScholarshipId { get; set; }
        public string ScholarshipTitle { get; set; }
        public string ScholarshipDescription { get; set; }
        public string EligibilityCriteria { get; set; }
        public DateTime ApplicationStartDate { get; set; }
        public DateTime ApplicationEndDate { get; set; }
        public string ScholarshipType { get; set; }
        public Guid ContactStaffId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool CanNotify { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
        public bool IsSelfEnrollable { get; set; } = false;
        public string SelfEnrollUrl { get; set; }

        public Staff? ContactStaff { get; set; }
    }
}
