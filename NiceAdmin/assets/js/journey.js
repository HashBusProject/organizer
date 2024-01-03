$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetNumberOfJourneys", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("numberOfJourneys").innerHTML = xhr.responseText;
        }
    }
    xhr.send();
});

function getNameOfPoint(id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetNameOfPoint?pointId=" + id, true);
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
    xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetAllJourneys", true);
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
        var data = $("#example").DataTable().row($(this).parents('tr')).data();
        addFunction(data);
        $('#addstopPoint').modal('show');

    });

    function editFunction(data) {
        var sourcePoint = document.getElementById("sourcePointEdit");
        var destinationPoint = document.getElementById("destinationPointEdit");
        var priceInput = document.getElementById("price");
        var journeyNameInput = document.getElementById("journeyName");
        var idJourneyInput = document.getElementById("idJourney");
    
        priceInput.value = data.price;
        journeyNameInput.value = data.name;
        idJourneyInput.value = data.id;
    
        $.ajax({
            url: "https://global-memento-407716.uc.r.appspot.com/Organizer/ViewAllPoint",
            method: "GET",
            success: function (points) {
                if (!points || !Array.isArray(points) || points.length === 0) {
                    alert("No points available");
                    return;
                }
    
                sourcePoint.innerHTML = "";
                destinationPoint.innerHTML = "";
    
                for (var i = 0; i < points.length; i++) {
                    var option = document.createElement("option");
                    option.value = points[i].id;
                    option.text = points[i].pointName;
                    sourcePoint.appendChild(option);
                }
    
                for (var i = 0; i < points.length; i++) {
                    var option = document.createElement("option");
                    option.value = points[i].id;
                    option.text = points[i].pointName;
                    destinationPoint.appendChild(option);
                }
    
                $('#editJourneyModal').modal('show');
            },
            error: function (error) {
                alert("Error fetching points: " + error.responseText);
            }
        });
    }
    

    function deleteFunction(data) {
        var isConfirmed = confirm("Are you sure you want to delete this journey?");
    
        if (!isConfirmed) {
            return;
        }
    
        var id = {
            id: data.id
        };
    
        $.ajax({
            url: "https://global-memento-407716.uc.r.appspot.com/Organizer/DeleteJourney",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(id),
            success: function (data) {
                alert("Journey deleted successfully!");
                window.location.reload();
            },
            error: function (error) {
                alert("Error deleting journey: " + error.responseText);
            }
        });
    }
    

    function showFunction(data) {
        fetchEndpointDataForJourney(data.id);
        $('#showStopPoint').modal('show');

    }

    function addFunction(data) {
        var stopPoint = document.getElementById("stopPoint");
        document.getElementById("journeyId").value = data.id;
        document.getElementById("index").value = data.stopPoints.length;
        $.ajax({
            url: "https://global-memento-407716.uc.r.appspot.com/Organizer/ViewAllPoint",
            method: "GET",
            success: function (points) {
                for (var i = 0; i < points.length; i++) {
                    var option = document.createElement("option");
                    option.value = points[i].id;
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
function showAddFeild() {
    var sourcePoint = document.getElementById("sourcePointAdd");
    var destinationPoint = document.getElementById("destinationPointAdd");
    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/ViewAllPoint",
        method: "GET",
        success: function (points) {
            for (var i = 0; i < points.length; i++) {
                var option = document.createElement("option");
                option.value = points[i].id;
                option.text = points[i].pointName;
                sourcePoint.appendChild(option);
            }
            for (var i = 0; i < points.length; i++) {
                var option = document.createElement("option");
                option.value = points[i].id;
                option.text = points[i].pointName;
                destinationPoint.appendChild(option);
            }
            $('#addJourney').modal('show');
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
}

function addJourney() {
    var sourcePoint = document.getElementById("sourcePointAdd").value;
    var destinationPoint = document.getElementById("destinationPointAdd").value;
    var journeyname = document.getElementById("addPointName").value;
    var price = document.getElementById("addTicketJourney").value;

    if (!sourcePoint || !destinationPoint || !journeyname || !price) {
        alert("Please fill in all fields");
        return;
    }

    if (sourcePoint === destinationPoint) {
        alert("Source point cannot be the same as destination point");
        return;
    }

    var journey = {
        sourcePoint: sourcePoint,
        destinationPoint: destinationPoint,
        name: journeyname,
        price: price
    };

    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/AddJourney",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(journey),
        success: function (data) {
            alert("Journey added successfully!");
            window.location.reload();
        },
        error: function (data) {
            alert("Error in adding data");
        }
    });
}



function editJourney() {
    var sourcePoint = document.getElementById("sourcePointEdit").value;
    var destinationPoint = document.getElementById("destinationPointEdit").value;
    var journeyName = document.getElementById("journeyName").value;
    var ticketPrice = document.getElementById("price").value;
    var id = document.getElementById("idJourney").value;

    if (!sourcePoint || !destinationPoint || !journeyName || !ticketPrice || !id) {
        alert("Please fill in all fields");
        return;
    }

    if (sourcePoint === destinationPoint) {
        alert("Source point cannot be the same as destination point");
        return;
    }

    var data = {
        id: id,
        sourcePoint: sourcePoint,
        destinationPoint: destinationPoint,
        price: ticketPrice,
        name: journeyName
    };

    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/EditJourney",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
        success: function (data) {
            alert("Journey updated successfully!");
            window.location.reload();
        },
        error: function (error) {
            alert("Error in updating Journey");
        }
    });
}


function addStopPoint() {
    var stopPointId = document.getElementById("stopPoint").value;
    var index = document.getElementById("index").value;
    var journeyId = document.getElementById("journeyId").value;
    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/AddStopPointToJourney?pointId=" + stopPointId + "&journeyId=" + journeyId + "&index=" + index,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        success: function (data) {
            alert("Stop point added asunccessfully!");
            window.location.reload();
        },
        error: function (data) {
            alert("Error to add stop point");
        }
    })
}
function fetchEndpointDataForJourney(journeyId) {
    const apiUrl = `https://global-memento-407716.uc.r.appspot.com/Organizer/GetStopPointOfJourney?journeyId=${journeyId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(point => createEndpointCard(point));
            } else {
                console.error('Invalid data structure:', data);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function createEndpointCard(point) {
    const cardContainer = document.getElementById('cardContainer');

    const card = document.createElement('div');
    card.className = 'card text-white bg-primary mb-3';
    card.style = 'max-width: 18rem;';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.style = 'color: aliceblue;';
    cardTitle.textContent = point.pointName;

    cardBody.appendChild(cardTitle);

    card.appendChild(cardBody);

    cardContainer.appendChild(card);
}
$('#showStopPoint').on('hidden.bs.modal', function (e) {
    $('#cardContainer').empty();
});