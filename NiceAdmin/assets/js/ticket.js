$(document).ready(function() {
    var xhr = new XMLHttpRequest() ; 
    xhr.open("GET" , "http://localhost:8080/Organizer/GetNumberOfTickets" , true) ; 
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            document.getElementById("numberOfTickets").innerHTML = xhr.responseText ;
        }
    }
    xhr.send();
    });
    