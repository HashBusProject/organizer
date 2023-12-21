$(document).ready(function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET" , "http://localhost:8080/Organizer/GetNumberOfSchedules" , true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var data = xhr.responseText;
            document.getElementById("numberOfTrips").innerHTML = data;
        }
    }
    xhr.send();
});
function getNameOfJourney(id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/Organizer/GetNameOfJourneyById?journeyId="+ id, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var name = xhr.responseText;
            callback(name);
        }
    }
    xhr.send();
}

$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8080/Organizer/GetAllSchedule",
        method: "GET",
        contentType: 'application/json',
        success: function (trips) {
            var deferreds = $.map(trips, function (trip) {
                var deferred = $.Deferred();
                getNameOfJourney(trip.journey, function (journeyName) {
                    trip.journeyName = journeyName;
                    deferred.resolve();
                });
                return deferred.promise();
            });

            $.when.apply($, deferreds).done(function () {
                $('#example').DataTable({
                    data: trips,
                    columns: [
                        { data: "journeyName" },
                        { data: "bus" },
                        { data: "time" },
                        { data: "passengersNumber" },
                        {
                            data: null,
                            defaultContent: "<button class='edit-button'>Edit</button>"
                        },
                        {
                            data: null,
                            defaultContent: "<button class='delete-button'>Delete</button>"
                        }
                    ]
                });
                
            });
        },
    });
    $('#example').on('click', '.edit-button', function () {
        var data = $("#example").DataTable().row($(this).parents('tr')).data();
        console.log("saif")  ;
    });
    
    $('#example').on('click', '.delete-button', function () {
        var data = $("#example").DataTable().row($(this).parents('tr')).data();
        console.log(data) ;
        $.ajax({
            url : "http://localhost:8080/Organizer/DeleteSchedule?scheduleId="+data.scheduleId, 
            method : "DELETE" , 
            contentType: 'application/json',
            success:function(data){
                alert("Trip was deleted") ; 
                window.location.reload() ; 
            },
            error:function(data) {
                alert("Error in delete trip") ; 
            }
        });
    });
    
});

function showAddFeild() {
    var journeySelect = document.getElementById("journeyName") ; 
    $.ajax({
        url : "http://localhost:8080/Organizer/GetAllJourneys" , 
        method : "GET" , 
        contentType: 'application/json',
        success:function(journey) { 
            for(var i = 0; i < journey.length ; i++){
                var option = document.createElement("option");
                option.value = journey[i].id ;
                option.text = journey[i].name;
                journeySelect.appendChild(option);
        }
        $('#addTrip').modal('show');
        } , 

    });
}

function addSchedule(){
    var journey = document.getElementById("journeyName").value ; 
    var bus = document.getElementById("busID").value ; 
    var time = document.getElementById("timeInput").value ; 
    alert(journey + " " + bus + " " + time) ; 
}