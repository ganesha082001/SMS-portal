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
    [Route("Education/[controller]")]
    [ApiController]
    public class EducationalInfoController : Controller
    {

        private readonly ScholarshipPortalContext _context;

        public EducationalInfoController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // create a new educational info after checking if educational info exists
        [HttpPost]
        public async Task<ActionResult<EducationalInfo>> PostEducationalInfo(EducationalInfo educationalInfo)
        {
            var existingEducationalInfo = await _context.EducationalInfo.FirstOrDefaultAsync(s => s.StudentId == educationalInfo.StudentId && !s.IsDeleted);
            if (existingEducationalInfo != null)
            {
                return BadRequest(new { responseCode = "denied", message = "Educational Info already exists" });
            }

            _context.EducationalInfo.Add(educationalInfo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetEducationalInfo", new { id = educationalInfo.StudentId }, educationalInfo);
        }

        // get educational info by studentID
        [HttpGet("{id}")]
        public async Task<ActionResult<EducationalInfo>> GetEducationalInfo(Guid id)
        {
            var educationalInfo = await _context.EducationalInfo.FirstOrDefaultAsync(e => e.StudentId == id && !e.IsDeleted);
            if (educationalInfo == null || educationalInfo.IsDeleted == true)
            {
                return NotFound(new { responseCode = "notfound", message = "Educational Info not found" });
            }
            return educationalInfo;
        }

        // update educational info by studentID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEducationalInfo(Guid id, EducationalInfo educationalInfo)
        {
            if (id != educationalInfo.StudentId)
            {
                return BadRequest(new { responseCode = "denied", message = "Student ID does not match" });
            }
            _context.Entry(educationalInfo).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (! EducationalInfoExists(id))
                {
                    return NotFound(new { responseCode = "notfound", message = "Educational Info not found" });
                }
                else
                {
                    return BadRequest(new { responseCode = "denied", message = "Educational Info already exists" });
                }
            }
            return Ok(educationalInfo);
        }

         private bool EducationalInfoExists(Guid id)
        {
            return _context.EducationalInfo.Any(e => e.StudentId == id);
        }
    }
}
