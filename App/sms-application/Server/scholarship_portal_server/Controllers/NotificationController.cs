using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using scholarship_portal_server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace scholarship_portal_server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly ScholarshipPortalContext _context;

        public NotificationController(ScholarshipPortalContext context)
        {
            _context = context;
        }

        // create a new notification
        [HttpPost]
        public async Task<ActionResult<Notification>> PostNotification(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetNotification", new { id = notification.NotificationId }, notification);
        }

        // get all notifications based on  MessageTo add contact info also
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {
            return await _context.Notifications.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Notification>> GetNotification(Guid id)
        {
            var notification = await _context.Notifications
                .Include(n => n.ContactStaff) // Assuming ContactStaff is the navigation property for Staff
                .FirstOrDefaultAsync(n => n.NotificationId == id && !n.IsDeleted);

            if (notification == null)
            {
                return NotFound();
            }

            var contactStaff = await _context.Staffs
                .FirstOrDefaultAsync(s => s.Id == notification.ContactPersonID);

            return Ok(new
            {
                notification.NotificationId,
                notification.MessageTitle,
                notification.MessageTo,
                notification.Message,
                notification.ContactPersonID,
                notification.NotificationType,
                notification.StartDate,
                notification.EndDate,
                notification.CanNotify,
                notification.CreatedAt,
                notification.UpdatedAt,
                notification.IsDeleted,
                ContactStaff = contactStaff == null ? null : new
                {
                    contactStaff.Id,
                    contactStaff.staffName,
                    contactStaff.staffId,
                    contactStaff.StaffPhone,
                    contactStaff.StaffUsername
                }
            });
        }

        // update notification by id and return all notifications
        [HttpPut("{id}")]
        public async Task<ActionResult<IEnumerable<Notification>>> PutNotification(Guid id, Notification notification)
        {
            if (id != notification.NotificationId)
            {
                return BadRequest();
            }

            _context.Entry(notification).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return await _context.Notifications.ToListAsync();
        }

        // delete notification by id and set isdeleted to true

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return NotFound();
            }
            notification.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        private bool NotificationExists(Guid id)
        {
            return _context.Notifications.Any(e => e.NotificationId == id);
        }



    }
}

