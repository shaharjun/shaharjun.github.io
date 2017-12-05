
function sendChat(){
	var html = "<li class='replies'>"
		+ "<img src='images/profile.png' alt='' />"
		+"<p style=\"word-wrap: break-word\">" +$('#chatBox').val() + "</p></li>";
	$('.messages ul').append(html);
	$('#chatBox').val(' ');
}


$(document).ready(function() {

	if("pratChatToken" in localStorage){
		console.log("Access Allowed");
	}
	else{
		console.log("Access Denied, redirecting to Login");
		window.location.href = "login.html";
	}	
	$(".expand-button").click(function() {
		$("#profile").toggleClass("expanded");
		$("#contacts").toggleClass("expanded");
	});
	$('.contact').click(function() {
		$('.messages ul').empty();
	});

	$('#logout-button').click(function(){
		localStorage.removeItem("pratChatToken");
		window.location.href="login.html";
	});	

	$("#profile-img").click(function() {
		$("#status-options").toggleClass("active");
	});

	$("#status-options ul li").click(function() {
		$("#profile-img").removeClass();
		$("#status-online").removeClass("active");
		$("#status-away").removeClass("active");
		$("#status-busy").removeClass("active");
		$("#status-offline").removeClass("active");
		$(this).addClass("active");

		if($("#status-online").hasClass("active")) {
			$("#profile-img").addClass("online");
		} else if ($("#status-away").hasClass("active")) {
			$("#profile-img").addClass("away");
		} else if ($("#status-busy").hasClass("active")) {
			$("#profile-img").addClass("busy");
		} else if ($("#status-offline").hasClass("active")) {
			$("#profile-img").addClass("offline");
		} else {
			$("#profile-img").removeClass();
		};

		$("#status-options").removeClass("active");
	});
});