const API_URL = "https://localhost:7257/api/car";

let cars = [];

loadCars();


// ----------------------
// Load Cars
// ----------------------

async function loadCars() {

    try {

        const response =
        await fetch(
            API_URL
        );

        const result = await response.json();
        cars = result;
        displayCars(cars);

    }

    catch {

        document
        .getElementById("carList")
        .innerHTML =
        `
        <h3 class="text-danger text-center">

            Không thể kết nối tới máy chủ.

        </h3>
        `;

    }

}



// ----------------------
// Display Cars
// ----------------------

function displayCars(data){

    let html = "";

    data.forEach(car => {

        html +=
        `
        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card h-100">

                <img
                src="images/${car.ImageUrl}"
                class="card-img-top">

                <div class="card-body">

                    <h4>

                        ${car.CarName}

                    </h4>


                    <h6 class="text-secondary">

                        ${car.BrandName}

                    </h6>


                    <p>

                        ${car.Specs}

                    </p>


                    <div class="price mb-3">

                        ${Number(car.Price).toLocaleString("vi-VN")}
                        VNĐ

                    </div>


                    <a
                    href="appointment.html?id=${car.CarId}"
                    class="btn btn-primary w-100">

                        Đặt Lịch Tư Vấn

                    </a>

                </div>

            </div>

        </div>
        `;
    });

    document
    .getElementById("carList")
    .innerHTML = html;

}



// ----------------------
// Search
// ----------------------

document
.getElementById("searchInput")
.addEventListener(
"keyup",
()=>{

    const keyword =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();


    const filtered =
    cars.filter(car =>

        car.CarName
        .toLowerCase()
        .includes(keyword)

        ||

        car.BrandName
        .toLowerCase()
        .includes(keyword)

    );


    displayCars(filtered);

});