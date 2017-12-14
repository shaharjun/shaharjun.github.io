function validatePassword() {
	$("#password").on('input', function () {
		var password = $("#password").val();
		$("#password").addClass("invalid");
		if (password.length >= 6) {
			$("#password").removeClass("invalid");
		}
	});
}

String.prototype.hashCode = function () {
	var hash = 0,
		i, char;
	if (this.length === 0)
		return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return hash;
}

function validateRegisterForm(formComplete, fullname, phone, email, password) {
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
	}
	return formComplete;
}

function getLocalStorage(key) {
	var returnValue;
	try {
		returnValue = JSON.parse(localStorage.getItem(key));
	} catch (e) {
		console.log("Error getting " + key + " from localStorage");
		console.log(e);
	}
	return returnValue;
}

function setLocalStorage(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch(e){
		console.log("Error setting " + key + ":" + value + " in localStorage");
		console.log(e);
	}
}


