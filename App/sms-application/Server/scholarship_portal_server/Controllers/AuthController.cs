using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace scholarship_portal_server.Controllers
{
    [AllowAnonymous]
    [Route("/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;
        private readonly TokenService _tokenService;

        public AuthController(ScholarshipPortalContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login/student")]
        public async Task<IActionResult> StudentLogin([FromBody] LoginModel loginModel)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.studentusername == loginModel.Username && s.studentpassword == loginModel.Password);

            if (student == null || student.isDeleted)
            {
                return Unauthorized(new { responseCode = "denied" });
            }

            var token = _tokenService.GenerateToken(student.studentusername, "Student");
            return Ok(new { responseCode = "allowed", id = student.StudentId, token });
        }

        [HttpPost("login/staff")]
        public async Task<IActionResult> StaffLogin([FromBody] LoginModel loginModel)
        {
            var staff = await _context.Staffs
                .FirstOrDefaultAsync(s => s.StaffUsername == loginModel.Username && s.StaffPassword == loginModel.Password);

            if (staff == null || staff.isDeleted || staff.staffPrivilageId == 4)
            {
                return Unauthorized(new { responseCode = "denied" });
            }

            var token = _tokenService.GenerateToken(staff.StaffUsername, "Staff");
            return Ok(new { responseCode = "allowed", id = staff.Id, privilage = staff.staffPrivilageId, token });
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
            return Ok(new { id = student.StudentId });
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // Simple validation for phone number format
            return Regex.IsMatch(phoneNumber, @"^\+?[1-9]\d{1,14}$");
        }
    }

    public class LoginModel
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
