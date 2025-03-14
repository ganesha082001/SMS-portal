using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
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

            if (staff == null || staff.isDeleted)
            {
                return Unauthorized(new { responseCode = "denied" });
            }

            var token = _tokenService.GenerateToken(staff.StaffUsername, "Staff");
            return Ok(new { responseCode = "allowed", id = staff.Id, privilage = staff.staffPrivilageId, token });
        }
    }

    public class LoginModel
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
