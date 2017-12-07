/**
 * 
 */
$(document).ready(function(){
	$("#register-button").click(function(){
		formComplete = true;
		var fullname = $("#fullname").val();
		var phone = $("#phone").val();
		var email = $("#email").val();
		var password = $("#password").val();
		if(email === ""){
			Materialize.toast("Enter email", 1000);
			formComplete = false;
		}
		else if(fullname === ""){
			Materialize.toast("Enter full name", 1000);
			formComplete = false;
		}
		else if(phone === ""){
			Materialize.toast("Enter phone", 1000);
			formComplete = false;
		}
		else if(password === ""){
			Materialize.toast("Enter password", 1000);
			formComplete = false;
		}
		else{
			if(formComplete){
                if (localStorage.getItem("username") !== null) {
                    var emailToCheck = localStorage.getItem("pratChatEmail");
                    if(email === emailToCheck){
                        Materialize.toast("User already registered", 4000);
                    }
                }
				else{
					localStorage.setItem("pratChatEmail", email);
					localStorage.setItem("pratChatPassword", password);
					localStorage.setItem("pratChatPhone", phone);
					localStorage.setItem("pratChatFullName", fullname);
					localStorage.setItem("isRegistered", true);
					window.location.href = "login.html";
				}
			}
		}
	});
	validatePassword();
});
