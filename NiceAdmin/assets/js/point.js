$(document).ready(function(){
    var xhr = new XMLHttpRequest() ; 
    xhr.open("GET" , "http://localhost:8080/Admin/GetNumberOfPoint" , true) ; 
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200) { 
            data = xhr.responseText;
            document.getElementById("numberOfUser").innerHTML = data ; 
        }
    }
    xhr.send();
});


$(document).ready(function() {
    $.ajax({
        url: "http://localhost:8080/Organizer/ViewAllPoint",
        method: "GET",
        success: function(persons) {
            $("#example").DataTable({
                data: persons,
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

    // Event handling for edit button
    $('#example').on('click', '.edit-button', function() {
        var data = $("#example").DataTable().row($(this).parents('tr')).data();
        // Your edit button logic here
    });

    // Event handling for delete button
    $('#example').on('click', '.delete-button', function() {
        var data = $("#example").DataTable().row($(this).parents('tr')).data();
        var point_id = {
            id: data.id
        };
        $.ajax({
            url: "http://localhost:8080/Admin/DeletePoint",
            method: "POST",
            data: JSON.stringify(point_id),
            contentType: 'application/json',
            success: function(data) {
                if(data){
                    alert("Point Was Deleted") ; 
                    window.location.reload() ;
                }else {
                    alert("Error") ; 
                }
            },
            error: function(error) {
                alert ("Error deleting user:", error);
            }
        });
    });
});

function showAddFeild(){
    document.getElementById("addPointName").value = "";
    document.getElementById("addPointX").value = "";
    document.getElementById("addPointY").value = "";
    $('#addPointModal').modal('show');
}

function addPoint() {
    var x = document.getElementById("addPointY").value;
    var y = document.getElementById("addPointX").value;
    var pointName = document.getElementById("addPointName").value;
    var data = {
        pointName: pointName,
        x: x,
        y: y,
    };
    $.ajax({
        url: "http://localhost:8080/Admin/AddStopPoint",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
