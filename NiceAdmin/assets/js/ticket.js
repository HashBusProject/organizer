$(document).ready(function() {
    var xhrNumberOfTickets = new XMLHttpRequest();
    xhrNumberOfTickets.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetNumberOfTickets", true);
    xhrNumberOfTickets.onreadystatechange = function() {
        if (xhrNumberOfTickets.readyState == 4 && xhrNumberOfTickets.status == 200) {
            document.getElementById("numberOfTickets").innerHTML = xhrNumberOfTickets.responseText;
        }
    };
    xhrNumberOfTickets.send();

    var xhrGetAllTickets = new XMLHttpRequest();
    xhrGetAllTickets.open("GET", "https://global-memento-407716.uc.r.appspot.com/Organizer/GetAllTickets", true);
    xhrGetAllTickets.onreadystatechange = function() {
        if (xhrGetAllTickets.readyState == 4 && xhrGetAllTickets.status == 200) {
            var tickets = JSON.parse(xhrGetAllTickets.responseText);
            const ticketData = tickets.map(function(ticket) {
                const journeyName = ticket.journey ? ticket.journey.name : null;
                const studentEmail = ticket.user ? ticket.user.email : null;
                return {
                    id: ticket.id,
                    journeyName: journeyName,
                    studentEmail: studentEmail
                };
            });

            var table = $("#example").DataTable({
                data: ticketData,
                columns: [
                    { data: "id" },
                    { data: "journeyName" },
                    { data: "studentEmail" },
                ],
            });

            $('#example tbody').on('click', 'button.delete-btn', function() {
                var row = table.row($(this).parents('tr')).data();
                var isConfirmed = confirm("Are you sure you want to delete ticket ID " + row.id + "?");
                if (isConfirmed) {
                    deleteTicket(row.id);
                }
            });
        }
    };
    xhrGetAllTickets.send();
});

function deleteTicket() {
    var isConfirmed = confirm("Are you sure you want to delete this ticket?");

    if (!isConfirmed) {
        return;
    }

    var xhrDeleteTicket = new XMLHttpRequest();
    xhrDeleteTicket.open("DELETE", "https://global-memento-407716.uc.r.appspot.com/Organizer/DeleteAllTickets", true);

    xhrDeleteTicket.onreadystatechange = function() {
        console.log(xhrDeleteTicket.status);
        if (xhrDeleteTicket.readyState == 4) {
            if (xhrDeleteTicket.status == 200) {
                handleDeleteSuccess();
            } else {
                handleDeleteError();
            }
        }
    };

    xhrDeleteTicket.send();

    function handleDeleteSuccess() {
        alert("Ticket deleted successfully!");
        window.location.reload();
    }

    function handleDeleteError() {
        alert("Error deleting ticket");
    }
}

