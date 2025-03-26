namespace scholarship_portal_server.Models
{
    public class ProfileInfoDTO
    {
        public Student StudentInfo { get; set; }
        public PersonalInfo PersonalInfo { get; set; }
        public EducationalInfo EducationalInfo { get; set; }
        public ScholarshipInfo ScholarshipInfo { get; set; }
    }
}
