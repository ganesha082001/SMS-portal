using System.ComponentModel.DataAnnotations;

namespace scholarship_portal_server.Models
{
    public class PersonalInfo
    {

        [Key]
        public Guid PersonalId { get; set; }
        public Guid StudentId { get; set; }
        public string Community { get; set; }
        public string AadharNumber { get; set; }
        public string AadharMobileNumber { get; set; }
        public bool HasCommunityCertificate { get; set; }
        public string CommunityCertificatePath { get; set; }
        public bool HasIncomeCertificate { get; set; }
        public string IncomeCertificatePath { get; set; }
        public bool IsDonePartTime { get; set; }
        public string PartTimeProofFilePath { get; set; }
        public DateTime? IncomeCertificateIssuedDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }

}
