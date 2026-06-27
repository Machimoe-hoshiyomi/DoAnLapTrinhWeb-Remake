const API_URL = "https://localhost:7257/api/user";

document
.getElementById("registerForm")
.addEventListener(
"submit",
async (e)=>{

e.preventDefault();

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

const fullName =
document.getElementById("fullName").value;

const phone =
document.getElementById("phone").value;

const email =
document.getElementById("email").value;


const response =
await fetch(
`${API_URL}/register`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username,
password,
fullName,
phone,
email

})

}

);

if(response.ok){

alert(
"Đăng ký thành công!"
);

window.location.href =
"login.html";

}
else {
    const errorData = await response.json();
    console.log("Chi tiết lỗi:", errorData); // Xem kỹ trong F12 Console
    // Nối thêm dòng lỗi chi tiết vào alert
    alert("Lỗi: " + errorData.title + "\n" + JSON.stringify(errorData.errors));
}

});