$(document).ready(function () {
	// if (getLocalStorage("generatedId") == null) {
	// 	setLocalStorage("generatedId", 1);
	// 	console.log('user id set');
	// }
	$("#register-button").click(function () {
		var formComplete = true;
		var fullname = $("#fullname").val();
		var phone = $("#phone").val();
		var email = $("#email").val();
		var password = $("#password").val();
		var isFormComplete = validateRegisterForm(formComplete, fullname, phone, email, password);
		if (isFormComplete) {
			var thisUser = null;

			//thiUser = getLocalStorage("thisUser");
			if (thisUser !== null) {
				var registeredUser = getLocalStorage("thisUser");
				var emailToCheck = registeredUser.emailId;
				if (email === emailToCheck) {
					Materialize.toast("User already registered", 4000);
				}
			} else {
				var user = new User();
				user.emailId = email;
				user.password = password;
				user.phoneNo = phone;
				user.fullName = fullname;
				var generatedId = parseInt(getLocalStorage("generatedId"));
				console.log(generatedId);
				user.userId = ++generatedId;

				// create user method is in userUtil, registers user in localStorage
				createUser(user);

				setLocalStorage("generatedId", generatedId);
				setLocalStorage("isRegistered", true);
				window.location.href = "login.html";
			}
		}
		else{
			return false;
		}
	});
	validatePassword();
});