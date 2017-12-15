$(document).ready(function(){
	var user = null;	
	// Get data from local storage
	user = getLocalStorage("thisUser");
	// Get data from java server
		
	if(user === null){
		$("#email").val("");
	}
	if(getLocalStorage("sessionId") !== null || getLocalStorage("isRegistered") !== null){
		$("#email").val(user.emailId);
	}
	else{
		console.log("token does not exist");
	}
	$("#login-button").click(function(){
		var email = $("#email").val();
		var password = $("#password").val();
		if(email === ""){
			Materialize.toast("Enter email", 1000);
		}
		else if(password === ""){
			Materialize.toast("Enter password", 1000);
		}
		else if(user.emailId === email && user.password=== password){
			setLocalStorage("sessionId",email.hashCode());
			window.location.href = "index.html";
		}
		else{
			Materialize.toast("Incorrect email or password", 2000);
		}
	});
	validatePassword();
});
