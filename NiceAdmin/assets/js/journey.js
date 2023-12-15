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
    var sourcePoint = document.getElementById("sourcePointEdit") ; 
    var destinationPoint = document.getElementById("destinationPointEdit") ; 
    document.getElementById("price").value = data.price  ; 
    document.getElementById("journeyName").value = data.name ;
    document.getElementById("idJourney").value = data.id;
    $.ajax({
        url: "http://localhost:8080/Organizer/ViewAllPoint",
        method: "GET",
        success: function (points) {
            for(var i = 0; i < points.length ; i++){
                    var option = document.createElement("option");
                    option.value = points[i].id ;
                    option.text = points[i].pointName;
                    sourcePoint.appendChild(option);
            }
            for(var i = 0; i < points.length ; i++){
                var option = document.createElement("option");
                option.value = points[i].id ;
                option.text = points[i].pointName;
                destinationPoint.appendChild(option);
        }
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
    var stopPoint = document.getElementById("stopPoint") ; 
$.ajax({
    url: "http://localhost:8080/Organizer/ViewAllPoint",
    method: "GET",
    success: function (points) {
        for(var i = 0; i < points.length ; i++){
            var option = document.createElement("option");
            option.value = points[i].id ;
            option.text = points[i].pointName;
            stopPoint.appendChild(option);
    }
        $('#addstopPoint').modal('show');
    },
    error: function (error) {
        alert(error.responseText);
    }
});
}
    });
    function showAddFeild(){
        $('#addJourney').modal('show');
    }
    






    function fetchEndpointDataForJourney(journeyId) {
        const apiUrl = `your-api-endpoint?journeyId=${journeyId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                createEndpointCard(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function createEndpointCard(data) {
        const cardContainer = document.getElementById('cardContainer');

        const card = document.createElement('div');
        card.className = 'card text-white bg-primary mb-3';
        card.style = 'max-width: 18rem;';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.style = 'color: aliceblue;';
        cardTitle.textContent = data.endpointName;  

        cardBody.appendChild(cardTitle);

        card.appendChild(cardBody);

        cardContainer.appendChild(card);
    }




function editJourney() {
    var sourcePoint = document.getElementById("sourcePointEdit").value;  
    var destinationPoint = document.getElementById("destinationPointEdit").value;  
    var journeyName = document.getElementById("journeyName").value;  
    var ticketPrice = document.getElementById("price").value;  
    var id = document.getElementById("idJourney").value;
    var data = {
        id : id,  
        sourcePoint : sourcePoint , 
        destinationPoint : destinationPoint , 
        price : ticketPrice ,
        name : journeyName 
    }
    $.ajax({
        url : "http://localhost:8080/Organizer/EditJourney" , 
        method : "POST"  , 
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
            success: function (data) {
            alert("Journey updated successfully!");
            window.location.reload();
        },
        error: function (error) {
            alert("Error in delete Journey");
        }
    });

}