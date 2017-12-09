/**
 * 
 */
$(document).ready(function(){
	var user = JSON.parse(localStorage.getItem("thisUser"));
	if(user === null){
		$("#email").val("");
	}
	if(localStorage.getItem("sessionId") !== null || localStorage.getItem("isRegistered") !== null){
		console.log("token already exists");
		console.log(user.emailId);
		$("#email").val(user.emailId);
	}
	else{
		console.log("token does not exist");
	}
	$("#login-button").click(function(){
		var email = $("#email").val();
		var password = $("#password").val();
		console.log(email);
		console.log(password);
		if(email === ""){
			Materialize.toast("Enter email", 1000);
		}
		else if(password === ""){
			Materialize.toast("Enter password", 1000);
		}
		else if(user.emailId=== email && user.password===password){
			localStorage.setItem("sessionId",email.hashCode());
			window.location.href = "index.html";
		}
		else{
			Materialize.toast("Incorrect email or password", 2000);
		}
	});
	validatePassword();
});
