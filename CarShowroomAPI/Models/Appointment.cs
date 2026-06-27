using System;
using System.Collections.Generic;

namespace CarShowroomAPI.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int? UserId { get; set; }

    public int? CarId { get; set; }

    public DateTime? AppointmentDate { get; set; }

    public string? CustomerNote { get; set; }

    public string? Status { get; set; }

    public virtual Car? Car { get; set; }

    public virtual User? User { get; set; }
}
