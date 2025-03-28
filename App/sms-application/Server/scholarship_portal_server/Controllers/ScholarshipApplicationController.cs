using Microsoft.AspNetCore.Mvc;
using scholarship_portal_server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scholarship_portal_server.Controllers
{
    public class ScholarshipApplicationController : Controller
    {
        private readonly ScholarshipPortalContext _context;

        public ScholarshipApplicationController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // list of students with profile status verified and reviewer id is not null, not is deleted
        [HttpGet("studentList")]
        public async Task<ActionResult> Getsudents()
        {
            var scholarshipApplications = await _context.StudentProfiles
                .Where(sp => sp.ProfileStatus == "Verified" && sp.ReviewerId != null && !sp.IsDeleted)
                .Join(_context.Students,
                      sp => sp.StudentId,
                      s => s.StudentId,
                      (sp, s) => new { s.StudentName, s.StudentId })
                .ToListAsync();
            return Ok(scholarshipApplications);
        }

        // list of scholarships with isdeleted as false, can notify 
        [HttpGet("scholarshipList")]
        public async Task<ActionResult> GetScholarships()
        {
            var scholarships = await _context.Scholarships
                .Where(s => !s.IsDeleted && s.CanNotify)
                .ToListAsync();
            return Ok(scholarships);
        }

        // create a new scholarship application
        [HttpPost("Createapplications")]
        public async Task<ActionResult<ScholarshipApplication>> PostScholarshipApplication(ScholarshipApplication scholarshipApplication)
        {
            _context.ScholarshipApplications.Add(scholarshipApplication);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetScholarshipApplication", new { id = scholarshipApplication.ScholarshipApplicationId }, scholarshipApplication);
        }

        // get all scholarship applications with IsDeleted as false
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScholarshipApplication>>> GetScholarshipApplications()
        {
            return await _context.ScholarshipApplications
                .Where(sa => !sa.IsDeleted)
                .ToListAsync();
        }

        // list of students applied with name, rollno, department, applied scholarship name, shift
        [HttpGet("appliedStudents")]
        public async Task<ActionResult> GetAppliedStudents()
        {
            var appliedStudents = await _context.ScholarshipApplications
                .Join(_context.Students,
                      sa => sa.StudentId,
                      s => s.StudentId,
                      (sa, s) => new { sa, s })
                .Join(_context.EducationalInfo,
                      ss => ss.s.StudentId,
                      ei => ei.StudentId,
                      (ss, ei) => new { ss.sa, ss.s, ei })
                .Join(_context.Scholarships,
                      sse => sse.sa.ScholarshipId,
                      sch => sch.ScholarshipId,
                      (sse, sch) => new
                      {
                          sse.s.StudentName,
                          sse.s.StudentRollnumber,
                          sse.ei.Department,
                          ScholarshipName = sch.ScholarshipTitle,
                          sse.ei.Shift
                      })
                .ToListAsync();
            return Ok(appliedStudents);
        }


    }
}
