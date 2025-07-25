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
        window.location.href = 'case-studies/designlab.html';
    });
});


$(document).ready(function() {
    $("#sns").click(function() {
        window.location.href = 'case-studies/sns.html';
    });
});




$(document).ready(function() {
    $("#inchdesign").click(function() {
        window.location.href = 'case-studies/inch-design.html';
    });
});

$(document).ready(function() {
    $("#resume-redesign").click(function() {
        window.location.href = 'case-studies/resume-redesign.html';
    });
});

$(document).ready(function() {
    $("#aromacovery-dupe").click(function() {
        window.location.href = 'case-studies/aromacovery-dupe.html';
    });
});

const hamburgerL = document.querySelector(".hamburger");
const menuL = document.querySelector(".menu");

function myFunction(x){
    x.classList.toggle("active");
}

var animation = lottie.loadAnimation({
    container: document.getElementById('lottie-animation-container'), // the DOM element that will contain the animation
    renderer: 'svg', // or 'canvas' or 'html'
    loop: true,
    autoplay: true,
    path: 'https://media.dave-vo.com/file/dvfolio/designlab/lottie-generate-why.lottie' // the path to the animation json
});