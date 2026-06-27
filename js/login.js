const API_URL = "https://localhost:7257/api/user";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Username: username, Password: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.Message);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.User));
    alert("Đăng nhập thành công!");
    if (data.User.Role.toLowerCase() === 'admin') {
        window.location.replace("admin.html");
    } else {
        window.location.replace("index.html");
    }
  } catch (err) {
    console.error("Lỗi chi tiết:", err);
    alert("Lỗi thật sự là: " + err.message); // Nó sẽ khai ra lỗi code chứ không báo mất kết nối nữa
  }
});