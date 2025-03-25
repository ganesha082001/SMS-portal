using System;
using System.ComponentModel.DataAnnotations;

namespace scholarship_portal_server.Models
{
    public class Notification
    {
        [Key]
        public Guid NotificationId { get; set; }

        [Required]
        [StringLength(200)]
        public string MessageTitle { get; set; }

        [Required]
        public int MessageTo { get; set; }

        [Required]
        [StringLength(1000)]
        public string Message { get; set; }

        [Required]
        public Guid ContactPersonID { get; set; }

        [Required]
        public int NotificationType { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool CanNotify { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
        public Staff? ContactStaff { get; set; }

    }
}

