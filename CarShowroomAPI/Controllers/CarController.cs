using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShowroomAPI.Models;

namespace CarShowroomAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly CarShowroomDbContext _context;

        // FIX LỖI Ở ĐÂY: Hàm khởi tạo chuẩn chỉnh để Inject DbContext
        public CarController(CarShowroomDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Car (Lấy danh sách tất cả các xe)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        {
            var cars = await _context.Cars.ToListAsync();
            return Ok(cars);
        }

        // 2. GET: api/Car/5 (Lấy chi tiết 1 chiếc xe theo ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Không tìm thấy xe này ông ơi!" });
            }

            return Ok(car);
        }

        // 3. POST: api/Car (Thêm xe mới - Dành cho Admin)
        [HttpPost]
        public async Task<ActionResult<Car>> PostCar(Car car)
        {
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCar), new { id = car.CarId }, car);
        }

        // 4. PUT: api/Car/5 (Cập nhật thông tin xe - Dành cho Admin)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCar(int id, Car car)
        {
            if (id != car.CarId)
            {
                return BadRequest(new { message = "ID không trùng khớp!" });
            }

            _context.Entry(car).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Cars.Any(e => e.CarId == id))
                {
                    return NotFound(new { message = "Xe không tồn tại để cập nhật!" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Cập nhật xe thành công nhé ông!" });
        }

        // 5. DELETE: api/Car/5 (Xóa xe - Dành cho Admin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound(new { message = "Xe này không tồn tại hoặc đã bị xóa trước đó!" });
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa xe thành công!" });
        }
    }
}