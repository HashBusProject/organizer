$(document).ready(function () {
    var isLoggedIn = localStorage.getItem('isLoggedIn') ; 
    if(isLoggedIn){
        window.location.href = "dashboard.html" ; 
    }
});
function login() { 
    var username = document.getElementById("username").value; 
    var password = document.getElementById("password").value ; 
    var user = {
        username: username,
        password: password
    };

    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/Login",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(user),
        success: function (data) {
            var token = data.token;

            var expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (1 * 60 * 60 * 1000));
            document.cookie = "token=" + token + "; expires=" + expirationDate.toUTCString() + "; path=/";

            alert("Login successful");
            localStorage.setItem('isLoggedIn' , true) ; 
            window.location.href = "dashboard.html" ;
        },
        error: function (xhr) {
            alert("Login failed: " + xhr.responseText);
        },
    });
}
