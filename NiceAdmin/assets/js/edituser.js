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