$(document).ready(function () {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var token = getCookie("token");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetNumberOfJourneys", true);

    xhr.setRequestHeader("Authorization", "Bearer " + token);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                document.getElementById("numberOfJourneys").innerHTML = xhr.responseText;
            } else {
                console.error("Error: " + xhr.status + " - " + xhr.statusText);
            }
        }
    };

    xhr.send();
});

function getNameOfPoint(id, callback) {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var token = getCookie("token");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetNameOfPoint?pointId=" + id, true);

    xhr.setRequestHeader("Authorization", "Bearer " + token);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var name = xhr.responseText;
                callback(name);
            } else {
                console.error("Error: " + xhr.status + " - " + xhr.statusText);
            }
        }
    };

    xhr.send();
}


$(document).ready(function () {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    var token = getCookie("token");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetAllJourneys", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
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
        document.getElementById("price").value = data.price;
        document.getElementById("journeyName").value = data.name;
        document.getElementById("idJourney").value = data.id;
    
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
                "Authorization": "Bearer " + token
            },
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
                $('#editJourneyModal').modal('show');
            },
            error: function (error) {
                alert(error.responseText);
            }
        });
    }
    


    function deleteFunction(data) {
        var id = {
            id: data.id
        };
    
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
    
        var token = getCookie("token");
    
        $.ajax({
            url: "https://global-memento-407716.uc.r.appspot.com/Organizer/DeleteJourney",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify(id),
            success: function (data) {
                alert("Journey deleted successfully!");
                window.location.reload();
            },
            error: function (error) {
                alert("You must delete the journeys from schedule");
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
    
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var token = getCookie("token");

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
            'Authorization': 'Bearer ' + token
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

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var token = getCookie("token");

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
            'Authorization': 'Bearer ' + token
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

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var token = getCookie("token");

    $.ajax({
        url: "https://global-memento-407716.uc.r.appspot.com/Organizer/AddStopPointToJourney?pointId=" + stopPointId + "&journeyId=" + journeyId + "&index=" + index,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            alert("Stop point added successfully!");
            window.location.reload();
        },
        error: function (data) {
            alert("Error adding stop point");
        }
    });
}

function fetchEndpointDataForJourney(journeyId) {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var token = getCookie("token");

    const apiUrl = `https://global-memento-407716.uc.r.appspot.com/Organizer/GetStopPointOfJourney?journeyId=${journeyId}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
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