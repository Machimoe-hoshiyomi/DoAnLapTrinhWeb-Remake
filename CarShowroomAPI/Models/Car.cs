using System;
using System.Collections.Generic;

namespace CarShowroomAPI.Models;

public partial class Car
{
    public int CarId { get; set; }

    public string CarName { get; set; } = null!;

    public string? BrandName { get; set; }

    public decimal? Price { get; set; }

    public string? Specs { get; set; }

    public string? ImageUrl { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
