namespace scholarship_portal_server.Models
{
    public class DropdownGroup
    {
        public Guid DropdownGroupId { get; set; }
        public required string DropdownGroupName { get; set; }
        public required string DropdownGroupCode { get; set; }
        public bool isDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<DropdownValue>? DropdownValues { get; set; }
    }
}
