/**
 * 
 */
$(document).ready(function(){
	if("pratChatEmail" === undefined){
		$("#email").val("");
	}
	if("pratChatToken" in localStorage || "isRegistered" in localStorage){
		console.log("token already exists");
		console.log(localStorage.getItem("pratChatEmail"));
		$("#email").val(localStorage.getItem("pratChatEmail"));
	}
	else{
		console.log("token does not exist");
	}
	$("#login-button").click(function(){
		var email = $("#email").val();
		var password = $("#password").val();
		console.log(email);
		console.log(password);
		if(email == ""){
			Materialize.toast("Enter email", 1000);
		}
		else if(password == ""){
			Materialize.toast("Enter password", 1000);
		}
		else if(localStorage.getItem("pratChatEmail")== email && localStorage.getItem("pratChatPassword")==password){
			localStorage.setItem("pratChatToken",email.hashCode());
			window.location.href = "index.html";
		}
		else{
			Materialize.toast("Incorrect email or password", 2000);
		}
	});
	validatePassword();
});
