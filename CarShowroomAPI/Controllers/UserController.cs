using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShowroomAPI.Models;

namespace CarShowroomAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CarShowroomDbContext _context;

        public UserController(CarShowroomDbContext context)
        {
            _context = context;
        }

        // 1. POST: api/user/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // Dùng _context.Set<User>() để ép nó dùng Model của mình, dẹp thằng IdentityUser qua 1 bên
            var checkUser = await _context.Set<User>().FirstOrDefaultAsync(u => u.Username == user.Username);
            if (checkUser != null)
            {
                return BadRequest(new { Message = "Tên đăng nhập này đã có người sử dụng!" });
            }

            user.Role = "Customer";

            _context.Set<User>().Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Đăng ký thành công!" });
        }

        // 2. POST: api/user/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Set<User>()
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);

            if (user == null)
            {
                return BadRequest(new { Message = "Sai tên đăng nhập hoặc mật khẩu ông ơi!" });
            }

            return Ok(new
            {
                Message = "Đăng nhập thành công!",
                User = user
            });
        }
    }

    public class LoginRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}