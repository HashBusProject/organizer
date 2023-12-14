function login() { 
    var username = document.getElementById("username").value; 
    var password = document.getElementById("password").value ; 
    var user = {
        username : username,
        password : password 
    };
    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Admin/Login",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(user),
        success: function (data) {
            alert("Login successful");
            window.location.href = "AddUser.html" ;
        },
        error: function (xhr) {
            alert("Login failed: " + xhr.responseText);
        },
    });
}