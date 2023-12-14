function addUser(){
    var name = document.getElementById("addName").value;
    var username = document.getElementById("addUserName").value;
    var email = document.getElementById("addEmail").value;
    var password = document.getElementById("addPassword").value;
    var selectElement = document.getElementById("inputState").selectedIndex;
    var data = {
        name : name , 
        username : username , 
        email : email , 
        password : password , 
        role : selectElement + 1 
    } 
    $.ajax({
        url : "https://global-memento-407716.uc.r.appspot.com/Admin/AddUser",
        method : "POST" , 
        data : JSON.stringify(data), 
        headers: {
            'Content-Type': 'application/json',
         },    
            success: function (data) {
                console.log("Success:", data);
                alert("User Added Successfully!!");
            },
        error: function (error) {
            alert(error.responseText);
        },

    });
}

$(document).ready(function(){
    var xhr = new XMLHttpRequest() ; 
    xhr.open("Get" , "https://global-memento-407716.uc.r.appspot.com/Admin/GetNumberOfUser" , true) ;
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200) { 
            data = xhr.responseText;
            document.getElementById("numberOfUser").innerHTML = data ; 
        }
    }
    xhr.send();
});