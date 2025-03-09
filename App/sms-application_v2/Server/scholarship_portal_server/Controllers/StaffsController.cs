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
    public class StaffsController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;
        private readonly IConfiguration _configuration;

        public StaffsController(ScholarshipPortalContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // create a controller method to get all staffs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaffs()
        {
            return await _context.Staffs.ToListAsync();
        }

        // create a controller method to get a staff by id
        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetStaff(Guid id)
        {
            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        // return a staff profile
        [HttpGet("profile/{id}")]
        public async Task<ActionResult<object>> GetStaffProfile(Guid id)
        {
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

        [HttpPost]
        public async Task<ActionResult<Staff>> PostStaff(Staff staff)
        {
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

        // create a controller method to update a staff
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaff(Guid id, Staff staff)
        {
            if (id != staff.Id)
            {
                return BadRequest();
            }
            _context.Entry(staff).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();

        }

        // create a controller method to delete a staff by id 
        // Delete should send the isdeleted value as true
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(Guid id)
        {
            var staff = await _context.Staffs.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }
            staff.isDeleted = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // create a controller method to authenticate a staff
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var staff = await _context.Staffs
                .FirstOrDefaultAsync(s => s.StaffUsername == loginModel.Username && s.StaffPassword == loginModel.Password);

            if (staff == null || staff.isDeleted )
            {
                return Unauthorized(new { responseCode = "denied" });
            }

            return Ok(new { responseCode = "allowed", id = staff.Id, privilage=staff.staffPrivilageId });
        }

        // create a controller to set privilage to a staff by id
        [HttpPut("setprivilage/{id}")]
        public async Task<IActionResult> SetPrivilage(Guid id, Staff staff)
        {
            if (id != staff.Id)
            {
                return BadRequest();
            }
            _context.Entry(staff).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // create a controller to get privilage 
        [HttpGet("getprivilage/{id}")]
        public async Task<ActionResult<object>> GetPrivilage(Guid id)
        {
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
    }

}
