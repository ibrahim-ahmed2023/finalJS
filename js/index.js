document.addEventListener("DOMContentLoaded", () => {
    initialize();
})

let initialize = async () => {
    await searchByName("");
    document.querySelector(".mainLoading").style.display = 'none';
    closeSideNav();
    allEvents();
}

let openSideNav = () => {
    document.querySelector(".side-nav").style.left = '0';
    toggleMenuIcon();
    animateLinks(0);
}

let closeSideNav = () => {
    let navWidth = document.querySelector(".side-nav .nav-items").offsetWidth;
    document.querySelector(".side-nav").style.left = `-${navWidth}px`;
    toggleMenuIcon();
    animateLinks(300);
}

let toggleMenuIcon = () => {
    let menuIcon = document.querySelector(".openAndClose");
    menuIcon.classList.toggle("fa-x");
    menuIcon.classList.toggle("fa-bars");
}

let animateLinks = (top) => {
    let links = document.querySelectorAll(".links li");
    links.forEach((link, index) => {
        link.style.top = `${top}px`;
        link.style.transitionDelay = `${(index + 5) * 100}ms`;
    });
}

let allEvents = () => {
    document.querySelector(".openAndClose").addEventListener("click", () => {
        if (document.querySelector(".side-nav").style.left === '0px') {
            closeSideNav();
        } else {
            openSideNav();
        }
    })
    document.getElementById('getCategories').addEventListener('click', async () => {
        await getCategories();
        closeSideNav();
    })
    document.getElementById('getArea').addEventListener('click', async () => {
        await getArea();
        closeSideNav();
    })
    document.getElementById('getIngredients').addEventListener('click', async () => {
        await getIngredients();
        closeSideNav();
    })
    document.getElementById('showSearchInputs').addEventListener('click', () => {
        showSearchInputs();
        closeSideNav();
    })
}

let displayMeals = (mealArray) => {
    let rowData = document.getElementById("row");
    rowData.innerHTML = mealArray.map(meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `).join('');
}

let fetchData = async (url) => {
    $(".innerLoading").fadeIn(300);
    try {
        let response = await fetch(url);
        if (!response.ok) {throw new Error('Network response was not ok');}
        $(".innerLoading").fadeOut(300);
        return await response.json();
    } catch (error) {
        alert('Failed to fetch data: ' + error.message);
    }
}

let getCategories = async () => {
    let data = await fetchData('https://www.themealdb.com/api/json/v1/1/categories.php');
    displayCategories(data.categories);
}

let displayCategories = (mealArray) => {
    let rowData = document.getElementById("row");
    rowData.innerHTML = mealArray.map(meal => `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${meal.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strCategoryThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${meal.strCategory}</h3>
                    <p>${meal.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
    `).join('');
}

let getArea = async () => {
    let data = await fetchData('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    displayArea(data.meals);
}

let displayArea = (mealArray) => {
    let rowData = document.getElementById("row");
    rowData.innerHTML = mealArray.map(meal => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${meal.strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${meal.strArea}</h3>
            </div>
        </div>
    `).join('');
}

let getIngredients = async () => {
    let data = await fetchData('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    displayIngredients(data.meals.slice(0, 20));
}

let displayIngredients = (mealArray) => {
    let rowData = document.getElementById("row");
    rowData.innerHTML = mealArray.map(meal => `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${meal.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${meal.strIngredient}</h3>
                <p>${meal.strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
    `).join('');
}

let getCategoryMeals = async (category) => {
    let data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    displayMeals(data.meals.slice(0, 20));
}

let getAreaMeals = async (area) => {
    let data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    displayMeals(data.meals.slice(0, 20));
}

let getIngredientsMeals = async (ingredient) => {
    let data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    displayMeals(data.meals.slice(0, 20));
}

let getMealDetails = async (mealID) => {
    let data = await fetchData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    displayMealDetails(data.meals[0]);
}

let displayMealDetails = (meal) => {
    let rowData = document.getElementById("row");
    let ingredients = Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`] ? `
        <li class="alert alert-info m-2 p-1">${meal[`strMeasure${i + 1}`]} ${meal[`strIngredient${i + 1}`]}</li>` : ''
    ).join('');

    let tags = meal.strTags ? meal.strTags.split(",").map(tag => `
        <li class="alert alert-danger m-2 p-1">${tag}</li>
    `).join('') : '';

    rowData.innerHTML = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${tags}</ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">YouTube</a>
        </div>
    `;
}

let showSearchInputs = () => {
    let searchContainer = document.getElementById("searchContainer");
    searchContainer.innerHTML = `
        <div class="row py-4 g-4">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control bg-white text-black" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-white text-black" type="text" placeholder="Search By First Letter">
            </div>
        </div>
    `;
}

let searchByName = async (term) => {
    $(".mainLoading").fadeOut(500)
    let data = await fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    displayMeals(data.meals || []);
}

let searchByFLetter = async (term) => {
    let data = await fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    displayMeals(data.meals || []);
};

let submitBtn;
let nameInput = false;
let emailInput = false;
let phoneInput = false;
let ageInput = false;
let passwordInput = false;
let repasswordInput = false;


function showContacts() {
    let rowData = document.getElementById("row");
    $(".innerLoading").fadeOut(300);

    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Invalid Name
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn");
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInput = true;
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInput = true;
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInput = true;
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInput = true;
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInput = true;
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInput = true;
    })
}



function inputsValidation() {
    if (nameInput) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInput) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInput) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInput) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInput) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInput) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled");
        submitBtn.classList.replace('btn-outline-danger','btn-outline-info')
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}

$('#showContacts').click(()=>{
    showContacts(); closeSideNav();
})
