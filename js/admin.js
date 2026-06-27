const API_APPOINTMENT = "https://localhost:7257/api/appointment";

// BẢO VỆ TRANG ADMIN
const userAdmin = JSON.parse(localStorage.getItem("user"));
if (!userAdmin || userAdmin.Role.toLowerCase() !== 'admin') {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.replace("index.html");
}

const API_URL = "https://localhost:7257/api/car";
let currentEditId = null; // Biến ghi nhớ xe đang sửa

loadCars();
loadAppointments();

// ====================\
// LOAD CARS
// ====================\
async function loadCars() {
  const response = await fetch(API_URL);
  const resultCar = await response.json();
  const cars = resultCar;

  document.getElementById("totalCars").innerText = cars.length;

  let html = "";

  cars.forEach(car => {
    html += `
      <tr>
        <td>${car.CarId}</td>
        <td>${car.CarName}</td>
        <td>${car.BrandName}</td>
        <td>${Number(car.Price).toLocaleString("vi-VN")}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="fillEditForm(${car.CarId})">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCar(${car.CarId})">Xóa</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("carTable").innerHTML = html;
}

// ====================\
// HÀM ĐẨY DATA LÊN FORM ĐỂ SỬA
// ====================\
function fillEditForm(id) {
    fetch(API_URL)
        .then(res => res.json())
        .then(result => {
            const car = result.data.find(c => c.CarID == id);
            if(car) {
                // Đổ dữ liệu lên các ô input
                document.getElementById("carName").value = car.CarName;
                document.getElementById("brandName").value = car.BrandName;
                document.getElementById("price").value = car.Price;
                document.getElementById("specs").value = car.Specs;
                document.getElementById("imageUrl").value = car.ImageUrl || "";
                
                currentEditId = id; // Đánh dấu ID đang sửa
                
                // Đổi nút "Thêm" thành nút "Lưu Sửa" màu vàng
                const btn = document.getElementById("addCarBtn");
                btn.innerText = "Lưu Sửa";
                btn.classList.replace("btn-success", "btn-warning");
            }
        });
}

// ====================\
// NÚT THÊM / LƯU XE
// ====================\
document.getElementById("addCarBtn").addEventListener("click", async () => {
  const carName = document.getElementById("carName").value;
  const brandName = document.getElementById("brandName").value;
  const price = document.getElementById("price").value;
  const specs = document.getElementById("specs").value;
  const imageUrl = document.getElementById("imageUrl").value;

  const payload = { carName, brandName, price, specs, imageUrl };

  if (currentEditId) {
      // 1. NẾU ĐANG CÓ ID -> GỌI API SỬA (PUT)
      await fetch(API_URL/{currentEditId}, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      });
      alert("Đã cập nhật thông tin xe!");
      
      // Reset lại nút về trạng thái "Thêm"
      currentEditId = null;
      const btn = document.getElementById("addCarBtn");
      btn.innerText = "Thêm";
      btn.classList.replace("btn-warning", "btn-success");
  } else {
      // 2. NẾU KHÔNG CÓ ID -> GỌI API THÊM (POST)
      await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      });
      alert("Đã thêm xe mới!");
  }

  // Xóa trắng form và tải lại bảng
  document.getElementById("carName").value = "";
  document.getElementById("brandName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("specs").value = "";
  document.getElementById("imageUrl").value = "";
  loadCars();
});

// ====================\
// XÓA XE
// ====================\
async function deleteCar(id) {
  if (!confirm("Bạn có chắc muốn xóa chiếc xe này không?")) return;
  await fetch(`${API_URL}/cars/${id}`, {
    method: "DELETE"
  });
  loadCars();
}

// ====================\
// LOAD APPOINTMENTS (LỊCH HẸN)
// ====================\
async function loadAppointments() {
  const response = await fetch(API_APPOINTMENT);
  const resultApp = await response.json();
  const apps = resultApp.data;

  document.getElementById("totalAppointments").innerText = apps.length;

  let done = 0;
  let cancel = 0;
  let html = "";

  apps.forEach(app => {
    if (app.Status === "Đã xử lý") done++;
    if (app.Status === "Đã hủy") cancel++;

    const appointmentDate = app.date || app.Date || app.AppointmentDate || "Không rõ";

    // 2. LOGIC NÚT BẤM
    let actionButtons = "";
    if (app.Status === "Chờ xử lý") {
        // Đang chờ -> Hiện nút Duyệt và Hủy
        actionButtons = `
          <button class="btn btn-success btn-sm" onclick="updateStatus(${app.AppointmentId}, 'Đã xử lý')">Duyệt</button>
          <button class="btn btn-danger btn-sm" onclick="updateStatus(${app.AppointmentId}, 'Đã hủy')">Hủy</button>
        `;
    } else {
        // Đã chốt -> Khóa lại và hiện nút Mở Khóa (trả về trạng thái Chờ xử lý)
        actionButtons = `
          <button class="btn btn-secondary btn-sm" disabled>Đã chốt</button>
          <button class="btn btn-outline-info btn-sm fw-bold" onclick="updateStatus(${app.AppointmentId}, 'Chờ xử lý')">
             Sửa (Mở khóa)
          </button>
        `;
    }

    html += `
      <tr>
        <td>${app.CustomerName}</td>
        <td>${app.CarName}</td>
        <td>${appointmentDate}</td>
        <td><span class="badge ${app.Status === 'Chờ xử lý' ? 'bg-warning text-dark' : (app.Status === 'Đã xử lý' ? 'bg-success' : 'bg-danger')}">${app.Status}</span></td>
        <td>
          ${actionButtons}
        </td>
      </tr>
    `;
  });

  document.getElementById("doneCount").innerText = done;
  document.getElementById("cancelCount").innerText = cancel;
  document.getElementById("appointmentTable").innerHTML = html;
}

// ====================\
// DUYỆT / HỦY LỊCH HẸN
// ====================\
async function updateStatus(id, status) {
  await fetch(API_URL/appointments/id/status, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  loadAppointments();
}