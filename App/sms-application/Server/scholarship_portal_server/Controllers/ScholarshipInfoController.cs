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
    [Route("Scholarshipinfo/[controller]")]
    [ApiController]
    public class ScholarshipInfoController : Controller
    {
        private readonly ScholarshipPortalContext _context;

        public ScholarshipInfoController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // create a new scholarship info after checking if scholarship info exists
        [HttpPost]
        public async Task<ActionResult<ScholarshipInfo>> PostScholarshipInfo(ScholarshipInfo scholarshipInfo)
        {
            var existingScholarshipInfo = await _context.ScholarshipsInfo.FirstOrDefaultAsync(s => s.StudentID == scholarshipInfo.StudentID);
            if (existingScholarshipInfo != null)
            {
                return BadRequest(new { responseCode = "denied", message = "Scholarship Info already exists" });
            }
            _context.ScholarshipsInfo.Add(scholarshipInfo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetScholarshipInfo", new { id = scholarshipInfo.StudentID }, scholarshipInfo);
        }

        // get scholarship info by studentID
        [HttpGet("{id}")]
        public async Task<ActionResult<ScholarshipInfo>> GetScholarshipInfo(Guid id)
        {
            var scholarshipInfo = await _context.ScholarshipsInfo.FirstOrDefaultAsync(s => s.StudentID == id && s.IsDeleted == false);
            if (scholarshipInfo == null)
            {
                return NotFound(new { responseCode = "notfound", message = "Scholarship Info not found" });
            }
            return scholarshipInfo;
        }
        // update scholarship info by studentID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScholarshipInfo(Guid id, ScholarshipInfo scholarshipInfo)
        {
            if (id != scholarshipInfo.StudentID)
            {
                return BadRequest(new { responseCode = "denied", message = "Student ID does not match" });
            }
            _context.Entry(scholarshipInfo).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScholarshipInfoExists(id))
                {
                    return NotFound(new { responseCode = "notfound", message = "Scholarship Info not found" });
                }
                else
                {
                    throw;
                }
            }
            return Ok(scholarshipInfo);
        }

        private bool ScholarshipInfoExists(Guid id)
        {
            return _context.ScholarshipsInfo.Any(e => e.StudentID == id);
        }

        // update scholarship info by studentID


    }
}
