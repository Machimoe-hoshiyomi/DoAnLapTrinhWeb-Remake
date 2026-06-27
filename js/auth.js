document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        const navMenu = document.querySelector(".navbar-nav");
        if (navMenu) {
            // Xóa Đăng nhập / Đăng ký
            const loginLink = navMenu.querySelector('a[href="login.html"]');
            const registerLink = navMenu.querySelector('a[href="register.html"]');
            if (loginLink) loginLink.parentElement.remove();
            if (registerLink) registerLink.parentElement.remove();

            // Nếu là Admin thì thêm nút Quản trị
            let adminBtn = "";
            if (user.Role === "Admin") {
                adminBtn = `<li class="nav-item"><a class="nav-link text-warning fw-bold" href="admin.html">Quản trị Showroom</a></li>`;
            }

            // Gắn Tên và nút Đăng xuất 
            navMenu.insertAdjacentHTML("beforeend", `
                ${adminBtn}
                <li class="nav-item"><span class="nav-link text-success fw-bold"> Chào, ${user.FullName}</span></li>
                <li class="nav-item"><a class="nav-link text-danger fw-bold" href="#" onclick="logout(event)">Đăng xuất</a></li>
            `);
        }
    }
});

function logout(e) {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.replace("login.html");
}