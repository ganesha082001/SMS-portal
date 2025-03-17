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
    [Authorize]
    [Route("/[controller]")]
    [ApiController]
    public class StaffsController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;
        private readonly IConfiguration _configuration;

        public StaffsController(ScholarshipPortalContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private bool ValidateToken()
        {
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token == null)
                return false;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaffs()
        {
            if (!ValidateToken())
                return Unauthorized();

            return await _context.Staffs.ToListAsync();
        }

        // to list the staffs that are awith privilage id 2 and 3 (admin and Active) and not deleted 



        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetStaff(Guid id)
        {
            if (!ValidateToken())
                return Unauthorized();

            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpGet("profile/{id}")]
        public async Task<ActionResult<object>> GetStaffProfile(Guid id)
        {
            if (!ValidateToken())
                return Unauthorized();

            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }
            return new
            {
                staff.staffId,
                staff.staffName,
                staff.StaffPhone,
                staff.StaffUsername,
                staff.staffPrivilageId
            };
        }

        [HttpPost("new/")]
        public async Task<ActionResult<Staff>> PostStaff(Staff staff)
        {
            if (!ValidateToken())
                return Unauthorized();

            if (string.IsNullOrEmpty(staff.staffName) || string.IsNullOrEmpty(staff.StaffUsername) || string.IsNullOrEmpty(staff.StaffPassword))
            {
                return BadRequest("Staff name, username, and password are required.");
            }

            if (_context.Staffs.Any(s => s.StaffUsername == staff.StaffUsername))
            {
                return Conflict("Username already exists.");
            }

            if (!IsValidPhoneNumber(staff.StaffPhone))
            {
                return BadRequest("Invalid phone number format.");
            }

            _context.Staffs.Add(staff);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetStaff", new { id = staff.Id }, staff);
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // Simple validation for phone number format
            return Regex.IsMatch(phoneNumber, @"^\+?[1-9]\d{1,14}$");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaff(Guid id, Staff staff)
        {
            if (!ValidateToken())
                return Unauthorized();

            if (id != staff.Id)
            {
                return BadRequest();
            }
            _context.Entry(staff).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(staff);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(Guid id)
        {
            if (!ValidateToken())
                return Unauthorized();

            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }
            staff.isDeleted = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var staff = await _context.Staffs
                .FirstOrDefaultAsync(s => s.StaffUsername == loginModel.Username && s.StaffPassword == loginModel.Password);

            if (staff == null || staff.isDeleted)
            {
                return Unauthorized(new { responseCode = "denied" });
            }

            return Ok(new { responseCode = "allowed", id = staff.Id, privilage = staff.staffPrivilageId });
        }

        [HttpPut("setprivilage/{id}")]
        public async Task<IActionResult> SetPrivilage(Guid id, int privilageId)
        {
            if (!ValidateToken())
                return Unauthorized();

            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            staff.staffPrivilageId = privilageId;
            _context.Entry(staff).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new { staff });
        }

        [HttpGet("getprivilage/{id}")]
        public async Task<ActionResult<object>> GetPrivilage(Guid id)
        {
            if (!ValidateToken())
                return Unauthorized();

            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }
            return new
            {
                staff.staffPrivilageId
            };
        }


        [HttpGet("activeStaffs")]
        public async Task<ActionResult<IEnumerable<Staff>>> GetPrivilegedStaffs()
        {
            if (!ValidateToken())
                return Unauthorized();

            var privilegedStaffs = await _context.Staffs
                .Where(s => (s.staffPrivilageId == 2 || s.staffPrivilageId == 3) && !s.isDeleted)
                .ToListAsync();

            return Ok(privilegedStaffs);
        }
    }
}
