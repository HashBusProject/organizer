$(document).ready(function() {
    var xhr = new XMLHttpRequest() ; 
    xhr.open("GET" , "https://global-memento-407716.uc.r.appspot.com/Organizer/GetNumberOfTickets" , true) ; 
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            document.getElementById("numberOfTickets").innerHTML = xhr.responseText ;
        }
    }
    xhr.send();
    });
    

    $(document).ready(function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetAllTickets" , true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var tickets = JSON.parse(xhr.responseText);
                const ticketData = tickets.map(function(ticket) {
                    const journeyName = ticket.journey ? ticket.journey.name : null;
                    const studentEmail = ticket.user ? ticket.user.email : null;
                    return {
                        id: ticket.id,
                        journeyName: journeyName,
                        studentEmail: studentEmail
                    };
                });
                $("#example").DataTable({
                    data: ticketData,
                    columns: [
                        { data: "id" },
                        { data: "journeyName" },
                        { data: "studentEmail" },
                    ],
                });
            }
        };
        xhr.send();
    });