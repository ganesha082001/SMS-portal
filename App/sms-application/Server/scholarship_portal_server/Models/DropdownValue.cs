namespace scholarship_portal_server.Models
{
    public class DropdownValue
    {
        public Guid DropdownValueId { get; set; }
        public required string DropdownValueName { get; set; }
        public bool isDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public required string DropdownGroupCode { get; set; }
        public Guid DropdownGroupId { get; set; }
    }
}
