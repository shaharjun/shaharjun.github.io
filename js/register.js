/**
 * 
 */
$(document).ready(function () {
	if (localStorage.getItem("generatedId") === null) {
		localStorage.setItem("generatedId", 1);
	}
	$("#register-button").click(function () {
		var user = {
			'fullName': '',
			'emailId': '',
			'userId': 0,
			'password': '',
			'phoneNo': 0,
			'profilePictureURL': '',
			'chatContacts': []
		};
		formComplete = true;
		var fullname = $("#fullname").val();
		var phone = $("#phone").val();
		var email = $("#email").val();
		var password = $("#password").val();
		if (email === "") {
			Materialize.toast("Enter email", 1000);
			formComplete = false;
		} else if (fullname === "") {
			Materialize.toast("Enter full name", 1000);
			formComplete = false;
		} else if (phone === "") {
			Materialize.toast("Enter phone", 1000);
			formComplete = false;
		} else if (password === "") {
			Materialize.toast("Enter password", 1000);
			formComplete = false;
		} else {
			if (formComplete) {
				if (localStorage.getItem("thisUser") !== null) {
					var registeredUser = JSON.parse(localStorage.getItem("thisUser"));
					var emailToCheck = registeredUser.emailId;
					if (email === emailToCheck) {
						Materialize.toast("User already registered", 4000);
					}
				} else {
					user.emailId = email;
					user.password = password;
					user.phoneNo = phone;
					user.fullName = fullname;
					var generatedId = parseInt(localStorage.getItem("generatedId"));
					user.userId = ++generatedId;
					localStorage.setItem("generatedId", generatedId);
					localStorage.setItem("thisUser", JSON.stringify(user));
					localStorage.setItem("isRegistered", true);
					window.location.href = "login.html";
				}
			}
		}
	});
	validatePassword();
});