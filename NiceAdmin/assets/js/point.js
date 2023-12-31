

$(document).ready(function() {
    // Function to retrieve the token from cookies
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var token = getCookie("token");

    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/ViewAllPoint",
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(points) {
            document.getElementById("numberOfUser").innerHTML = points.length; 
            
            $("#example").DataTable({
                data: points,
                columns: [
                    { data: "id" },
                    { data: "pointName" },
                    { data: "x" },
                    { data: "y" },
                ]
            });
        },
        error: function(error) {
            console.error("Error fetching data:", error);
        }
    });
});


function showAddFeild(){
    document.getElementById("addPointName").value = "";
    document.getElementById("addPointX").value = "";
    document.getElementById("addPointY").value = "";
    $('#addPointModal').modal('show');
}

function addPoint() {
    var token = getCookie("token");

    var x = document.getElementById("addPointY").value;
    var y = document.getElementById("addPointX").value;
    var pointName = document.getElementById("addPointName").value;
    
    var data = {
        pointName: pointName,
        x: x,
        y: y,
    };

    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/AddStopPoint",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token, 
        },
        data: JSON.stringify(data),
        success: function (data) {
            alert("Point Added Successfully!!!");
        },
        error: function (error) {
            alert(error.responseText);
            window.location.reload();
        },
    });
}

