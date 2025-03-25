using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scholarship_portal_server.Controllers
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class StudentProfileController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;

        public StudentProfileController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // create a new student profile
        [HttpPost]
        public async Task<ActionResult<StudentProfile>> PostStudentProfile(StudentProfile studentProfile)
        {
            var existingStudentProfile = await _context.StudentProfiles.FirstOrDefaultAsync(s => s.StudentId == studentProfile.StudentId && !s.IsDeleted);
            if (existingStudentProfile != null)
            {
                return BadRequest(new { responseCode = "denied", message = "Student profile already exists" });
            }
            _context.StudentProfiles.Add(studentProfile);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetStudentProfile", new { id = studentProfile.ProfileDataId }, studentProfile);
        }

        // get all student profiles if isdeleted is false
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentProfile>>> GetStudentProfiles()
        {
            return await _context.StudentProfiles.Where(s => !s.IsDeleted).ToListAsync();
        }


        // get student profile by id
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentProfile>> GetStudentProfile(Guid id)
        {
            var studentProfile = await _context.StudentProfiles.FindAsync(id);
            if (studentProfile == null || studentProfile.IsDeleted)
            {
                return NotFound();
            }
            return studentProfile;
        }

        // share review comments
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudentProfile(Guid id, StudentProfile studentProfile)
        {
            if (id != studentProfile.ProfileDataId)
            {
                return BadRequest();
            }
            _context.Entry(studentProfile).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}

