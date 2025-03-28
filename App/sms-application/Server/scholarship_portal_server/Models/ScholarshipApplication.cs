namespace scholarship_portal_server.Models
{
    public class ScholarshipApplication
    {
        public Guid ScholarshipApplicationId { get; set; }
        public Guid StudentId { get; set; }
        public Guid ScholarshipId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;

    }

}
