using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System;

namespace scholarship_portal_server.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class DropdownController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;

        public DropdownController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // get all dropdowngroups Values.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DropdownGroup>>> GetDropdownGroups()
        {
            return await _context.DropdownGroups.Include(dg => dg.DropdownValues).ToListAsync();
        }


        // New DropdownGroup creation method.
        [HttpPost]
        public async Task<ActionResult<DropdownGroup>> CreateDropdownGroup(DropdownGroup dropdownGroup)
        {
            _context.DropdownGroups.Add(dropdownGroup);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDropdownGroups), new { code = dropdownGroup.DropdownGroupCode }, dropdownGroup);
        }

        // Method to get all dropdownvalues for a particular dropdowngroupcode.
        [HttpGet("values/{code}")]
        public async Task<ActionResult<IEnumerable<DropdownValue>>> GetDropdownValues(string code)
        {
            var group = await _context.DropdownGroups.Include(dg => dg.DropdownValues).FirstOrDefaultAsync(dg => dg.DropdownGroupCode == code);
            if (group == null)
            {
                return NotFound();
            }
            return Ok(group.DropdownValues);
        }

        // update dropdowngroup method after updating return the guid of the updated dropdowngroup.
        [HttpPut("{code}")]
        public async Task<ActionResult<Guid>> UpdateDropdownGroup(string code, DropdownGroup dropdownGroup)
        {
            if (code != dropdownGroup.DropdownGroupCode)
            {
                return BadRequest();
            }
            _context.Entry(dropdownGroup).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return dropdownGroup.DropdownGroupId;
        }

        // method to delete a dropdowngroup by code, modify the isdeleted field to true.
        [HttpDelete("{code}")]
        public async Task<ActionResult<Guid>> DeleteDropdownGroup(string code)
        {
            var dropdownGroup = await _context.DropdownGroups.FirstOrDefaultAsync(dg => dg.DropdownGroupCode == code);
            if (dropdownGroup == null)
            {
                return NotFound();
            }
            dropdownGroup.isDeleted = true;
            await _context.SaveChangesAsync();
            return dropdownGroup.DropdownGroupId;
        }

    }
}