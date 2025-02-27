
//When document loads, will wait for the deleteAccountButton or logoutButton to be pressed and run the appropriate function
$(document).ready(function () {
    $("#deleteAccountButton").click(function () {
        deleteAccount(); // Delete account and wait for completion
    })

    $("#logoutButton").click(function(){
        logout()
    })
})

//function to run /delete from server when the button is pressed and also gives an error msg if it fails
function deleteAccount() {
    fetch("/delete", {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            console.log("redirecting")
            redirect();
        } else {
            console.error("Failed to delete account");
        }
    })
    .catch(error => {
        console.error("Error in deleteAccount:", error);
    });
}



function redirect() {
    window.location.href = "/"; // This will cause a page redirect
}

function redirectLogout(){
    window.location.href = "/login";
}

//logout function which does the same thing as delete function, instead it does /logout instead of delete
function logout() {
    fetch('/logout',{
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            console.log("redirecting")
            redirectLogout();
        } else {
            console.error("Failed to delete account");
        }
    })
    .catch(error => {
        console.error("Error in deleteAccount:", error);
    });
}