$(document).ready(function() {
var xhr = new XMLHttpRequest() ; 
xhr.open("GET" , "http://localhost:8080/Organizer/GetNumberOfJourneys" , true) ; 
xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 && xhr.status == 200){
        document.getElementById("numberOfJourneys").innerHTML = xhr.responseText ;
    }
}
xhr.send();
});

function getNameOfPoint(id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/Organizer/GetNameOfPoint?id=" + id, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var name = xhr.responseText;
            callback(name);
        }
    }
    xhr.send();
}

$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/Organizer/GetAllJourneys", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var journeys = JSON.parse(xhr.responseText);
            var pointNamePromises = journeys.map(function (journey) {
                return new Promise(function (resolve) {
                    getNameOfPoint(journey.sourcePoint, function (pointName) {
                        journey.sourcePointName = pointName;
                        getNameOfPoint(journey.destinationPoint, function (destinationPointName) {
                            journey.destinationPointName = destinationPointName;
                            resolve();
                        });
                    });
                });
            });
                        Promise.all(pointNamePromises)
                .then(function () {
                    $("#example").DataTable({
                        data: journeys,
                        columns: [
                            { data: "id" },
                            { data: "name" },
                            { data: "sourcePointName" }, 
                            { data: "destinationPointName" },
                            { data: "price" },
                            { 
                                data: null,
                                defaultContent: "<button class='show-button'>Show</button>"
                            },
                            {
                                data: null,
                                defaultContent: "<button class='add-button'>Add</button>"
                            },
                            {
                                data: null,
                                defaultContent: "<button class='edit-button'>Edit</button>"
                            },
                            {
                                data: null,
                                defaultContent: "<button class='delete-button'>Delete</button>"
                            }
                        ],
                    });
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    };
    xhr.send();

$('#example').on('click', '.edit-button', function () {
    var data = $("#example").DataTable().row($(this).parents('tr')).data();
    editFunction(data);
});

$('#example').on('click', '.delete-button', function () {
    var data = $("#example").DataTable().row($(this).parents('tr')).data();
    deleteFunction(data);
});

$('#example').on('click', '.show-button', function () {
    var data = $("#example").DataTable().row($(this).parents('tr')).data();
    showFunction(data);
});


$('#example').on('click', '.add-button', function () {
    addFunction();
    $('#addstopPoint').modal('show');

});

function editFunction(data) {
    var sourcePointDropdown = $("#sourcePoint");
    var destinationPointDropdown = $("#destinationPoint");
    $.ajax({
        url: "http://localhost:8080/Organizer/ViewAllPoint",
        method: "GET",
        success: function (points) {
            console.log(points);
            $('#editJourneyModal').modal('show');
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
    
}

function deleteFunction(data) {
    var id =  {
        id : data.id
    }
    $.ajax({
        url: "http://localhost:8080/Organizer/DeleteJourney",
        method: "Post",
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(id),
            success: function (data) {
            alert("Journey deleted successfully!");
            window.location.reload();
        },
        error: function (error) {
            alert("You must delete the journeys from schadule");
        }
    });
}

function showFunction(data) {
    console.log("Show button clicked for:", data);
}

function addFunction() {
    console.log("Add button clicked");
}
    });
    function showAddFeild(){
        $(document).ready(function(){
            var xhr = new XMLHttpRequest() ;
            const driver = document.getElementById("driverSelect") ; 
            xhr.open("Get" , "https://global-memento-407716.uc.r.appspot.com/Admin/GetUser?role=2" , true) ;
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200) { 
                    driverData = JSON.parse(xhr.responseText);
                    for(var i = 0 ;i < driverData.length ; i++){
                        var option = document.createElement("option");
                        option.value = driverData[i].userID ;
                        option.text = driverData[i].name;
                        driver.appendChild(option);
                    }
                }
            }
            xhr.send();
        });
        $('#addJourney').modal('show');
    }