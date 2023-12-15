$(document).ready(function(){
var xhr = new XMLHttpRequest() ; 
xhr.open("GET" , "https://global-memento-407716.uc.r.appspot.com/Admin/GetNumberOfBuses" , true ); 
xhr.onreadystatechange = function () { 
    if(xhr.readyState == 4 && xhr.status == 200) {
        document.getElementById("numberOfBus").innerHTML = xhr.responseText; 
    }
}
xhr.send() ;
});

// $(document).ready(function(){
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Admin/GetAllBuses" , true);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             var bus = JSON.parse(xhr.responseText);
            var busData = bus.map(function (bus) {
                return {
                    id: bus.id,
                    driverID: bus.driver ? bus.driver.userID : null,
                    isWorking: bus.isWorking
                };
            });           
//             $("#example").DataTable({
//                 data: busData,
//                 columns: [
//                     { data: "id" },
//                     { data: "driverID" },
//                     { data: "isWorking" },
//                     {
//                         data: null,
//                         defaultContent: "<button class='edit-button'>Edit</button>"
//                     },
//                     {
//                         data: null,
//                         defaultContent: "<button class='delete-button'>Delete</button>"
//                     }
//                 ],
//                 columnDefs: [
//                     { targets: [3, 4], searchable: false, orderable: false } // Exclude custom columns from search and ordering
//                 ]
//             });
//         }
//     };
//     xhr.send();
//     $('#example').on('click', '.edit-button', function() {
//         var data = $("#example").DataTable().row($(this).parents('tr')).data();
//         var busIdInput = document.getElementById("idBus");
//         busIdInput.value = data.id;
//         $(document).ready(function(){
//             const driver = document.getElementById("driverName") ; 
//             xhr.open("Get" , "https://global-memento-407716.uc.r.appspot.com/Admin/GetUser?role=2" , true) ;
//             xhr.onreadystatechange = function(){
//                 if(xhr.readyState == 4 && xhr.status == 200) { 
//                     driverData = JSON.parse(xhr.responseText);
//                     for(var i = 0 ;i < driverData.length ; i++){
//                         if(driverData[i].userID === data.driverID){
//                         var option = document.createElement("option");
//                         option.value = driverData[i].userID ;
//                         option.text = driverData[i].name;
//                         driver.appendChild(option);
//                         break;
//                         }
//                     }
//                     for(var i = 0 ;i < driverData.length ; i++){
//                         if(driverData[i].userID !== data.driverID){
//                         var option = document.createElement("option");
//                         option.value = driverData[i].userID ;
//                         option.text = driverData[i].name;
//                         driver.appendChild(option);
//                         }
//                     }
//                 }
//             }
//             xhr.send();
//         });        
//         // editId.value = data.userID;
//         $('#editUserModal').modal('show');
// });
// $('#example').on('click', '.delete-button', function() {
//     var data = $("#example").DataTable().row($(this).parents('tr')).data();
//     var dataPas = {
//         id: data.id ,  
//         driverID : data.driverID , 
//         isWorking : data.isWorking
//     };
//     $.ajax({
//         url: "https://global-memento-407716.uc.r.appspot.com/Admin/DeleteBus",
//         method: "POST",
//         data: JSON.stringify(dataPas),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         success: function(response) {
//             alert("Bus deleted successfully!");
//             window.location.reload() ;
//         },
//         error: function(error) {
//             alert("Error deleting Bus: " + error.responseText);
//             window.location.reload() ;
//         },
//     });
// });
//     });

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
    
    function editBus() {
        var driverId = document.getElementById("driverName").value;
        var isWorking = document.getElementById("isWorking").value;
        var id = document.getElementById("idBus").value ;
        var bus = {
            id  : id , 
            driver : { 
                userID : driverId 
            },
            isWorking : isWorking
        }
        JSON.stringify(bus.driver);
        $.ajax({
            url: "https://global-memento-407716.uc.r.appspot.com/Admin/EditBus",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(bus),
            success: function (data) {
                alert("Bus Updated Successfully!!!");
                window.location.reload() ; 
            },
            error: function (error) {
                alert("Error in updating bus");
                window.location.reload();
            },
        });
    } 
    document.addEventListener('DOMContentLoaded', function () {
        var editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal._element.addEventListener('hidden.bs.modal', function () {
                var driver = document.getElementById("driverName");
                driver.innerHTML = "" ;
            });
    });

    function addBus() {
        var driverId = document.getElementById("driverSelect").value ;
        var isWorking = document.getElementById("isWorkingSelect").value;
        var data = {
            driver : { 
                userID : driverId 
            }, 
            isWorking : isWorking
        };
        JSON.stringify(data.driver); 
        $.ajax({
            url: "https://global-memento-407716.uc.r.appspot.com/Admin/AddBus",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
            success: function (data) {
                alert("Bus Added Successfully!!!");
                window.location.reload() ;
            },
            error: function (error) {
                alert(error);
                window.location.reload();
            },
        });
    }
    