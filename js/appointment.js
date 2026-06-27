const API_URL = "https://localhost:7257/api/appointment";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  alert("Vui lòng đăng nhập trước.");
  window.location.replace("login.html");
}

const carId = new URLSearchParams(window.location.search).get("id");

document.getElementById("bookBtn").addEventListener("click", async () => {
  const date = document.getElementById("date").value;
  const note = document.getElementById("note").value;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      UserId: user.UserId,
      CarId: Number(carId),
      AppointmentDate: date,
      CustomerNote: note
    })
  });

  if (response.ok) {
    alert("Đặt lịch thành công!");
    window.location.href = "cars.html";
  } else {
    alert("Đặt lịch thất bại!");
  }
});