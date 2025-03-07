namespace scholarship_portal_server.Models
{
    public class Student
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentEmail { get; set; }
        public string StudentPhone { get; set; }
        public string StudentRollnumber { get; set; }
        public string studentusername { get; set; }
        public string studentpassword { get; set; }
        public bool isDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
