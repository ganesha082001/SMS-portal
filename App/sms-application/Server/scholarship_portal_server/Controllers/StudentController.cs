using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System.Text.RegularExpressions;

namespace scholarship_portal_server.Controllers
{
    [Authorize]
    [Route("/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;
        private readonly IConfiguration _configuration;
        private readonly TokenService _tokenService;

        public StudentController(ScholarshipPortalContext context, IConfiguration configuration, TokenService tokenService)
        {
            _context = context;
            _configuration = configuration;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.Where(s => !s.isDeleted).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(Guid id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null || student.isDeleted)
            {
                return NotFound();
            }
            return student;
        }

        [HttpGet("profile/{id}")]
        public async Task<ActionResult<object>> GetStudentProfile(Guid id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }
            return new
            {
                student.StudentId,
                student.StudentName,
                student.StudentEmail,
                student.StudentPhone,
                student.StudentRollnumber,
                student.studentusername
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<Student>> CreateStudent(Student student)
        {
            if (string.IsNullOrEmpty(student.StudentName) || string.IsNullOrEmpty(student.studentusername) || string.IsNullOrEmpty(student.studentpassword))
            {
                return BadRequest("Student name, username, and password are required.");
            }

            if (_context.Students.Any(s => s.studentusername == student.studentusername))
            {
                return Conflict("Username already exists.");
            }

            if (!IsValidPhoneNumber(student.StudentPhone))
            {
                return BadRequest("Invalid phone number format.");
            }

            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetStudent", new { id = student.StudentId }, student);
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // Simple validation for phone number format
            return Regex.IsMatch(phoneNumber, @"^\+?[1-9]\d{1,14}$");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(Guid id, Student student)
        {
            if (id != student.StudentId)
            {
                return BadRequest();
            }
            _context.Entry(student).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(Guid id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }
            student.isDeleted = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // New method to check if PersonalInfo, EducationalInfo, and ScholarshipInfo exist for a student
        [HttpGet("profilecheck/{studentId}")]
        public async Task<ActionResult<object>> CheckStudentInfoExists(Guid studentId)
        {
            var personalInfoExists = await _context.PersonalInfo.AnyAsync(p => p.StudentId == studentId && !p.IsDeleted);
            var educationalInfoExists = await _context.EducationalInfo.AnyAsync(e => e.StudentId == studentId && !e.IsDeleted);
            var scholarshipInfoExists = await _context.ScholarshipsInfo.AnyAsync(s => s.StudentID == studentId && !s.IsDeleted);

            return new
            {
                ProfileUpdateRequired = !(personalInfoExists && educationalInfoExists && scholarshipInfoExists)
            };
        }
    }
}
