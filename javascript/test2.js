function myFunction(x) {
    x.classList.toggle("change");
}

const hamburgerL = document.querySelector(".ham-menu");
const menuOptions = document.querySelector(".ham-menu-container");

function myFunction(x){
    console.log(menuOptions);
    x.classList.toggle("active");
    menuOptions.classList.toggle("change");
}