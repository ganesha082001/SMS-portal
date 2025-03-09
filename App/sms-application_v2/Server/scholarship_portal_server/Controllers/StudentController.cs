using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using scholarship_portal_server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace scholarship_portal_server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;
        private readonly IConfiguration _configuration;

        public StudentController(ScholarshipPortalContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // create a controller method to get all students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.Where(s => !s.isDeleted).ToListAsync();
        }

        // create a controller method to get a student by id
        // add a condition to check isdeleted. If isdeleted is true, return not found
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

        // return a student profile
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

        // create a controller method to create a student
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

        // create a controller method to update a student
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

        // create a controller method to authenticate a student
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.studentusername == loginModel.Username && s.studentpassword == loginModel.Password);

            if (student == null)
            {
                return Unauthorized(new { responseCode = "denied" });
            }

            return Ok(new { responseCode = "allowed", id = student.StudentId });
        }

        // create a controller method to delete a student
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
    }

    public class LoginModel
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
