
//404 Script, all it does is listens for the button to be pressed on page and redirects the 
//user to index
$(document).ready(function () {
    $("#goBackButton").click(function () {
        redirect(); 
    })
})

function redirect() {
    window.location.href = "/"; 
}