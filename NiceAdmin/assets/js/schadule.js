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
        var time = data.time;
        var journeySelectEdit = document.getElementById("journeyNameEdit");
        var bus_id_edit = document.getElementById("busIdEdit");

        document.getElementById("timeInputEdit").value = time.substring(0, time.length - 3);
        if(journeySelectEdit.length > 0 )
            journeySelectEdit.innerHTML ='' ; 
        if(bus_id_edit.length > 0)
            bus_id_edit.innerHTML = ""; 
        $.ajax({
            url: "http://localhost:8080/Organizer/GetAllJourneys",
            method: "GET",
            contentType: 'application/json',
            success: function (journeys) {
                for (var i = 0; i < journeys.length; i++) {
                    if(data.journey == journeys[i].id){
                    var option = document.createElement("option");
                    option.value = journeys[i].id;
                    option.text = journeys[i].name;
                    journeySelectEdit.appendChild(option);
                }
            }
                

                for (var i = 0; i < journeys.length; i++) {
                    if(data.journey != journeys[i].id){
                    var option = document.createElement("option");
                    option.value = journeys[i].id;
                    option.text = journeys[i].name;
                    journeySelectEdit.appendChild(option);
                }
            }

                $.ajax({
                    url: "http://localhost:8080/Organizer/GetIdOfBuses",
                    method: "GET",
                    contentType: 'application/json',
                    success: function (busIds) {
                        for (var i = 0; i < busIds.length; i++) {
                            if(data.bus == busIds[i].id){
                            var option = document.createElement("option");
                            option.value = busIds[i];
                            option.text = busIds[i];
                            bus_id_edit.appendChild(option);
                            
                        }
                        for (var i = 0; i < busIds.length; i++) {
                            if(data.bus != busIds[i].id){
                            var option = document.createElement("option");
                            option.value = busIds[i];
                            option.text = busIds[i];
                            bus_id_edit.appendChild(option);
                            
                        }
                    }
                    }
                }
                });

                $('#editTripModal').modal('show');
            }
        });
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
    var bus_id = document.getElementById("busID");
    if(journeySelect.length > 0 && bus_id.length > 0  ){
        $('#addTrip').modal('show');
        return;
    }
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

            $.ajax({
                url : "http://localhost:8080/Organizer/GetIdOfBuses" ,
                method : "GET" , 
                contentType: 'application/json',
                success:function(busId){
                    for(var i = 0 ; i < busId.length ; i++){
                        var option = document.createElement("option") ; 
                        option.value = busId[i];
                        option.text = busId[i];
                        bus_id.appendChild(option);
                    }
                }
            });
            $('#addTrip').modal('show');
        } , 


    });
}

function addSchedule(){
    var journey = document.getElementById("journeyName").value ; 
    var bus = document.getElementById("busID").value ; 
    var time = document.getElementById("timeInput").value ; 
    time += ":00" ; 
    schedule = { 
        journey : journey , 
        bus : bus , 
        time : time 
    }

    $.ajax({
        url : "http://localhost:8080/Organizer/AddSchedule" , 
        method : "POST" , 
        contentType: 'application/json',
        data : JSON.stringify(schedule) ,
        success:function(data) {
            alert("Schedule added successfully!") ; 
        } , 
        error:function(error) {
            alert("Error in add schedule") ; 
        }
    });

}


function editTrip() {
    var schedule_id = document.getElementById("idTripEdit").value ; 
    var bus = document.getElementById("busIdEdit").value ; 
    var journey = document.getElementById("journeyNameEdit").value; 
    var time = document.getElementById("timeInputEdit").value;
    time += ":00" ;
    var schedule = {
        scheduleId : schedule_id , 
        bus : bus , 
        journey : journey  , 
        time : time
    }
    $.ajax({
        url :  "http://localhost:8080/Organizer/EditSchedule",
        method : "PUT" , 
        contentType: 'application/json',
        data : JSON.stringify(schedule) ,
        success:function(data) {
            alert("Trip updated successfully!") ; 
        } , 
        error:function(data) {
            alert("Error in update trip") ; 
        }
    });
};