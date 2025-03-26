using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scholarship_portal_server.Controllers
{
    [Authorize]
    [Route("Personal/[controller]")]
    [ApiController]
    public class PersonalInfoController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;

        public PersonalInfoController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // Get all personal info for particular studentID where isDeleted is false
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonalInfo>>> GetPersonalInfo()
        {
            return await _context.PersonalInfo.Where(s => !s.IsDeleted).ToListAsync();
        }

        // Create a new personal info after checking if personal info exists
        [HttpPost]
        public async Task<ActionResult<PersonalInfo>> PostPersonalInfo(PersonalInfo personalInfo)
        {
            var existingPersonalInfo = await _context.PersonalInfo.FirstOrDefaultAsync(s => s.StudentId == personalInfo.StudentId && !s.IsDeleted);
            if (existingPersonalInfo != null)
            {
                return BadRequest(new { responseCode = "denied", message = "Personal Info already exists" });
            }
            _context.PersonalInfo.Add(personalInfo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPersonalInfo", new { id = personalInfo.StudentId }, personalInfo);
        }

        // Edit personal info by studentID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPersonalInfo(Guid id, PersonalInfo personalInfo)
        {
            if (id != personalInfo.StudentId)
            {
                return BadRequest();
            }
            _context.Entry(personalInfo).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonalInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(personalInfo);
        }

        // Get profile info by studentID
        [HttpGet("fullprofile/{studentId}")]
        public async Task<ActionResult<ProfileInfoDTO>> GetProfileInfo(Guid studentId)
        {
            var studentInfo = await _context.Students.FirstOrDefaultAsync(m => m.StudentId == studentId && !m.isDeleted);
            var personalInfo = await _context.PersonalInfo.FirstOrDefaultAsync(p => p.StudentId == studentId && !p.IsDeleted);
            var educationalInfo = await _context.EducationalInfo.FirstOrDefaultAsync(e => e.StudentId == studentId && !e.IsDeleted);
            var scholarshipInfo = await _context.ScholarshipsInfo.FirstOrDefaultAsync(s => s.StudentID == studentId && !s.IsDeleted);

            if (personalInfo == null || educationalInfo == null || scholarshipInfo == null)
            {
                return NotFound(new { responseCode = "not_found", message = "No record found" });
            }

            var profileInfo = new ProfileInfoDTO
            {
                StudentInfo = studentInfo,
                PersonalInfo = personalInfo,
                EducationalInfo = educationalInfo,
                ScholarshipInfo = scholarshipInfo
            };

            return profileInfo;
        }

        // get personal info by studentID
        [HttpGet("checkProfileExist/{id}")]
        public async Task<ActionResult<PersonalInfo>> GetPersonalInfo(Guid id)
        {
            var personalInfo = await _context.PersonalInfo.FirstOrDefaultAsync(p => p.StudentId == id && !p.IsDeleted);
            if (personalInfo == null)
            {
                return NotFound(new { responseCode = "not_found", message = "No record found" });
            }
            return personalInfo;
        }

        // PersonalInfoExists
        private bool PersonalInfoExists(Guid id)
        {
            return _context.PersonalInfo.Any(e => e.StudentId == id);
        }
    }
}
