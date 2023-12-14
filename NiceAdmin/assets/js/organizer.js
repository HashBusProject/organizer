$(document).ready(function(){
    var xhr = new XMLHttpRequest() ; 
    xhr.open("Get" , "https://global-memento-407716.uc.r.appspot.com/Admin/GetNumberOfUserByRole?role=3" , true) ;
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200) { 
            data = xhr.responseText;
            document.getElementById("numberOfUser").innerHTML = data ; 
        }
    }
    xhr.send();
});

$(document).ready(function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://global-memento-407716.uc.r.appspot.com/Admin/GetUser?role=3");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var persons = JSON.parse(xhr.responseText);
            $("#example").DataTable({
                data: persons,
                columns: [
                    { data: "userID" },
                    { data: "name" },
                    { data: "username" },
                    { data: "email" },
                    { data: "password" },
                    {
                        // Edit Button
                        data: null,
                        defaultContent: "<button class='edit-button'>Edit</button>"
                    },
                    {
                        // Delete Button
                        data: null,
                        defaultContent: "<button class='delete-button'>Delete</button>"
                    }
                ],
                columnDefs: [
                    { targets: [5, 6], searchable: false, orderable: false } // Exclude custom columns from search and ordering
                ]
            });
        }
    };
    xhr.send();

    function editUser() {
        const id = document.getElementById('id').value;
        const editName = document.getElementById("editName").value;
        const editUserName = document.getElementById('editUserName').value;
        const editEmail = document.getElementById('editEmail').value;
        const editPassword = document.getElementById("editPassword").value; 
        var data = {
            userID  : id , 
            name : editName , 
            username : editUserName , 
            email : editEmail , 
            password : editPassword , 
        } 
        console.log(JSON.stringify(data));
        $.ajax({
            url: 'https://global-memento-407716.uc.r.appspot.com/Admin/EditUser',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(data) {
                if(data) { 
                    alert("User apdated successfully!!") ; 
                    window.location.reload();
                }
            },
            error: function(error) {
                alert(error.responseText);
                window.location.reload();
            },
        });
    }
    // Event handling for edit and delete buttons
    $('#example').on('click', '.edit-button', function() {
        var data = $("#example").DataTable().row($(this).parents('tr')).data();
        const editUserName = document.getElementById('editUserName');
        const editEmail = document.getElementById('editEmail');
        const editId = document.getElementById("id");
        const editName = document.getElementById("editName");
        const editPassword = document.getElementById("editPassword");
        editId.value = data.userID;
        editUserName.value = data.username;
        editEmail.value = data.email;
        editName.value = data.name ; 
        editPassword.value = data.password;
        $('#editUserModal').modal('show');
});
    $('#example').on('click', '.delete-button', function() {
        var data = $("#example").DataTable().row($(this).parents('tr')).data();
        var id = {
            userID : data.userID 
        }
        console.log(id);
        $.ajax({
            url : "https://global-memento-407716.uc.r.appspot.com/Admin/DeleteUser" ,
            method :"POST" ,
            data : JSON.stringify(id),
            headers: {
                'Content-Type': 'application/json',
            },     
            success: function (data) {
                console.log(data);
                window.location.reload();
            },
            error: function (error) {
                alert(error.responseText);
                window.location.reload();
            },
        });
    });
    });