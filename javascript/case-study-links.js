$(document).ready(function() {
    $("#aromacovery").click(function() {
        window.location.href = 'case-studies/aromacovery.html';
    });
});

$(document).ready(function() {
    $("#sevenatenine").click(function() {
        window.location.href = 'case-studies/7ate9.html';
    });
});


$(document).ready(function() {
    $("#designlab").click(function() {
        window.location.href = 'case-studies/locked.html';
    });
});


$(document).ready(function() {
    $("#sns").click(function() {
        window.location.href = 'case-studies/sns.html';
    });
});

const hamburgerL = document.querySelector(".hamburger");
const menuL = document.querySelector(".menu");

function myFunction(x){
    x.classList.toggle("active");
}