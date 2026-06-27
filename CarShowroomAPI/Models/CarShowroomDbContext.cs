using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace CarShowroomAPI.Models;

public partial class CarShowroomDbContext : IdentityDbContext
{
    public CarShowroomDbContext()
    {
    }

    public CarShowroomDbContext(DbContextOptions<CarShowroomDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }
    public virtual DbSet<Car> Cars { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Để trống hàm này vì chuỗi kết nối đã được quản lý tập trung ở appsettings.json và Program.cs
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 🌟 BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐẦU HÀM ĐỂ KHỞI TẠO BẢNG IDENTITY CỦA MICROSOFT 🌟
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__8ECDFCA27C6C5A25");

            entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
            entity.Property(e => e.AppointmentDate).HasColumnType("datetime");
            entity.Property(e => e.CarId).HasColumnName("CarID");
            entity.Property(e => e.CustomerNote).HasMaxLength(500);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Chờ xử lý");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Car).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.CarId)
                .HasConstraintName("FK__Appointme__CarID__66603565");

            // Lưu ý: Mối quan hệ với User cũ đã được Identity tự động quản lý qua bảng AspNetUsers 
            // nên đoạn HasOne(d => d.User) cũ được lược bỏ để tránh xung đột dữ liệu.
        });

        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(e => e.CarId).HasName("PK__Cars__68A0340E3E853035");

            entity.Property(e => e.CarId).HasColumnName("CarID");
            entity.Property(e => e.BrandName).HasMaxLength(50);
            entity.Property(e => e.CarName).HasMaxLength(100);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}