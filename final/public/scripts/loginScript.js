$(document).ready(function () {
    // Initial setup

    //hides the create account form upon the page loading
    $("#createAccountForm").hide();

    //these two on click functions listen for the checkbox for show password to be clicked
    $("#checkbox").click(function () {
        showPassword()
    });

    $("#checkbox2").click(function () {
        showCreatePassword()
    });

    //these listen for the create user and back to login buttons to be pressod so they can
    //show and hide the right forms
    $("#toggleFormBtn").click(function () {
        console.log("Toggle button clicked");
        $("#loginForm").hide();
        $("#createAccountForm").show()
    });

    $("#toggleFormBtnBack").click(function () {
        console.log("Back to Login button clicked");
        $("#createAccountForm").hide();
        $("#loginForm").show();
    });
});


//Changes the password type to text so password is visible, also changes it back
//this is for the login
function showPassword() {
    var password = document.getElementById("passText");

    if (password.type == "password") {
        password.type = "text";
    }

    else {
        password.type = "password";
    }
}

//Same as the previous function but for the create user one
function showCreatePassword() {
    var createdPassword = document.getElementById("passMakeText");

    if (createdPassword.type == "password") {
        createdPassword.type = "text";
    }

    else {
        createdPassword.type = "password";
    }
}