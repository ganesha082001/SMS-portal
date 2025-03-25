using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace scholarship_portal_server.Models
{
    public class StudentProfile
    {
        [Key]
        public Guid ProfileDataId { get; set; } 
        public Guid PersonalInfoId { get; set; }
        public Guid EducationalInfoId { get; set; }
        public Guid ScholarshipInfoId { get; set; }
        public Guid StudentId { get; set; }
        public string ProfileStatus { get; set; }
        public string ReviewerId { get; set; }
        public string ReviewerComments { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
    }
}

