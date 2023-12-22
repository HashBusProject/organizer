function login() { 
    var username = document.getElementById("username").value; 
    var password = document.getElementById("password").value ; 
    var user = {
        username : username,
        password : password 
    };
    $.ajax({
        url: "http://localhost:8080/Organizer/Login",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(user),
        success: function (data) {
            alert("Login successful");
            window.location.href = "schedule.html" ;
        },
        error: function (xhr) {
            alert("Login failed: " + xhr.responseText);
        },
    });
}