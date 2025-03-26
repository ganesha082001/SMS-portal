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

        [HttpPut("review/{studentId}")]
        public async Task<IActionResult> PutStudentProfile(Guid studentId, ReviewInputModel input)
        {
            var studentProfile = await _context.StudentProfiles.FirstOrDefaultAsync(s => s.StudentId == studentId && !s.IsDeleted);
            if (studentProfile == null || studentProfile.IsDeleted)
            {
                return NotFound();
            }

            studentProfile.ReviewerComments = input.Message;
            studentProfile.ReviewerId = input.ReviewerId.ToString();
            studentProfile.ProfileStatus = input.Status;
            studentProfile.UpdatedAt = DateTime.UtcNow;

            _context.Entry(studentProfile).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class ReviewInputModel
        {
            public string Message { get; set; }
            public Guid ReviewerId { get; set; }
            public string Status { get; set; }
        }

        [HttpGet("CheckInfo/{studentId}")]
        public async Task<ActionResult<object>> CheckInfo(Guid studentId)
        {
            var personalInfo = await _context.PersonalInfo.FirstOrDefaultAsync(p => p.StudentId == studentId && !p.IsDeleted);
            var educationalInfo = await _context.EducationalInfo.FirstOrDefaultAsync(e => e.StudentId == studentId && !e.IsDeleted);
            var scholarshipInfo = await _context.ScholarshipsInfo.FirstOrDefaultAsync(s => s.StudentID == studentId && !s.IsDeleted);

            if (personalInfo == null && educationalInfo == null && scholarshipInfo == null)
            {
                return NotFound(new { responseCode = "not_found", message = "No matching information found for the provided student ID" });
            }

            return Ok(new
            {
                PersonalInfoId = personalInfo?.PersonalId,
                EducationalInfoId = educationalInfo?.EducationalId,
                ScholarshipInfoId = scholarshipInfo?.ScholarshipInfoID
            });
        }

        // list of students profile who are not reviewed yet add student details in the list
        [HttpGet("ReviewList")]
        public async Task<ActionResult<IEnumerable<object>>> GetReviewList()
        {
            var studentProfiles = await _context.StudentProfiles.Where(s => s.ReviewerId == "" && !s.IsDeleted).ToListAsync();
            var studentList = new List<object>();
            foreach (var studentProfile in studentProfiles)
            {
                var student = await _context.Students.FirstOrDefaultAsync(s => s.StudentId == studentProfile.StudentId && !s.isDeleted);
                if (student != null)
                {
                    studentList.Add(new
                    {
                        studentProfile.ProfileDataId,
                        studentProfile.StudentId,
                        studentProfile.ProfileStatus,
                        StudentName = student.StudentName,
                        StudentEmail = student.StudentEmail,
                        StudentPhone = student.StudentPhone,
                        StudentRollnumber = student.StudentRollnumber
                    });
                }
            }
            return Ok(studentList);
        }


    }
}

