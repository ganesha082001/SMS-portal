using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace scholarship_portal_server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ScholarshipController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;

        public ScholarshipController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // create a new scholarship after checking if scholarship exists
        [HttpPost]
        public async Task<ActionResult<Scholarship>> PostScholarship(Scholarship scholarship)
        {
            var existingScholarship = await _context.Scholarships.FirstOrDefaultAsync(s => s.ScholarshipTitle == scholarship.ScholarshipTitle && !s.IsDeleted);
            if (existingScholarship != null)
            {
                return BadRequest(new { responseCode = "denied", message = "Scholarship already exists" });
            }
            _context.Scholarships.Add(scholarship);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetScholarship", new { id = scholarship.ScholarshipId }, scholarship);
        }

        // get all scholarships if isdeleted is false
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Scholarship>>> GetScholarships()
        {
            return await _context.Scholarships.Where(s => !s.IsDeleted).ToListAsync();
        }

        // get scholarship by id
        [HttpGet("{id}")]
        public async Task<ActionResult<Scholarship>> GetScholarship(Guid id)
        {
            var scholarship = await _context.Scholarships.FindAsync(id);
            if (scholarship == null || scholarship.IsDeleted)
            {
                return NotFound();
            }
            return scholarship;
        }

        // update scholarship by id
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScholarship(Guid id, Scholarship scholarship)
        {
            if (id != scholarship.ScholarshipId)
            {
                return BadRequest();
            }
            _context.Entry(scholarship).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScholarshipExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // delete scholarship by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScholarship(Guid id)
        {
            var scholarship = await _context.Scholarships.FindAsync(id);
            if (scholarship == null)
            {
                return NotFound();
            }
            scholarship.IsDeleted = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ScholarshipExists(Guid id)
        {
            return _context.Scholarships.Any(e => e.ScholarshipId == id);
        }

        // get all scholarships by type
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<Scholarship>>> GetScholarshipsByType(string type)
        {
            return await _context.Scholarships.Where(s => s.ScholarshipType == type && !s.IsDeleted).ToListAsync();
        }

        // get all scholarships by staff id
        [HttpGet("staff/{id}")]
        public async Task<ActionResult<IEnumerable<Scholarship>>> GetScholarshipsByStaffId(Guid id)
        {
            return await _context.Scholarships.Where(s => s.ContactStaffId == id && !s.IsDeleted).ToListAsync();
        }

        // get all scholarships only if can notify is true
        [HttpGet("notify")]
        public async Task<ActionResult<IEnumerable<Scholarship>>> GetNotifiableScholarships()
        {

            var scholarships = await _context.Scholarships
                .Where(s => !s.IsDeleted)
                .Include(s => s.ContactStaff)
                .Select(s => new
                {
                    s.ScholarshipId,
                    s.ScholarshipTitle,
                    s.ScholarshipDescription,
                    s.EligibilityCriteria,
                    s.ApplicationStartDate,
                    s.ApplicationEndDate,
                    s.ScholarshipType,
                    s.ContactStaffId,
                    ContactStaff = new
                    {
                        s.ContactStaff.Id,
                        s.ContactStaff.staffName,
                        s.ContactStaff.staffId,
                        s.ContactStaff.StaffPhone,
                        s.ContactStaff.StaffUsername
                    },
                    s.CreatedAt,
                    s.UpdatedAt,
                    s.CanNotify,
                    s.IsDeleted,
                    s.IsSelfEnrollable,
                    s.SelfEnrollUrl
                })
                .ToListAsync();

            return Ok(scholarships);
        }

    }
}
