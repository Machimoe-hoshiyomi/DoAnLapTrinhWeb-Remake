using Microsoft.EntityFrameworkCore;
using CarShowroomAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. CẤU HÌNH ĐĂNG KÝ DBCONTEXT SỬ DỤNG SQL SERVER
builder.Services.AddDbContext<CarShowroomDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. BẬT CẤU HÌNH CORS (PHAO CỨU SINH CHO BẠN FRONT-END GỌI API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Ra lệnh cho C# giữ nguyên chữ Hoa chữ Thường khi trả JSON về
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// KÍCH HOẠT CORS TRONG PIPELINE (Phải đặt trước UseAuthorization)
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();