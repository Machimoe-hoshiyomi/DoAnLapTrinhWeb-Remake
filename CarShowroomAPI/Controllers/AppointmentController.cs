using Microsoft.AspNetCore.Mvc;
using CarShowroomAPI.Models;
using Microsoft.EntityFrameworkCore; // Cần cái này để dùng .Include()

namespace CarShowroomAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly CarShowroomDbContext _context;

        public AppointmentController(CarShowroomDbContext context)
        {
            _context = context;
        }

        // HÀM NÀY ĐỂ TRANG ADMIN GỌI DỮ LIỆU
        [HttpGet]
        public IActionResult GetAppointments()
        {
            var apps = _context.Appointments
                .Include(a => a.User)
                .Include(a => a.Car)
                .Select(a => new {
                    AppointmentId = a.AppointmentId,
                    CustomerName = a.User.FullName,
                    CarName = a.Car.CarName,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status
                })
                .ToList();
            return Ok(apps);
        }

        [HttpPost]
        public IActionResult CreateAppointment([FromBody] Appointment appointment)
        {
            try
            {
                appointment.Status = "Chờ xử lý";
                _context.Appointments.Add(appointment);
                _context.SaveChanges();
                return Ok(new { Message = "Đặt lịch thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}