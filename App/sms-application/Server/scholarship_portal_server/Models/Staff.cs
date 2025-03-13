namespace scholarship_portal_server.Models
{
    public class Staff
    {
        public Guid Id { get; set; }
        public string staffName { get; set; }
        public string staffId { get; set; }
        public int staffPrivilageId { get; set; }
        public string StaffPhone { get; set; }
        public string StaffUsername { get; set; }
        public string StaffPassword { get; set; }
        public bool isDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
