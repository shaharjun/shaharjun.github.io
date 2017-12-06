function validatePassword(){
	$("#password").on('input', function(){
		var password = $("#password").val();
		$("#password").addClass("invalid");
		if(password.length >= 6){
			$("#password").removeClass("invalid");
		}
	});
}
String.prototype.hashCode = function() {
	var hash = 0,i,char;
	if(this.length===0)
		return hash;
	for(i =0;i<this.length;i++) {
		chr = this.charCodeAt(i);
		hash = ((hash<<5)-hash) +chr;
		hash |=0;
	}
	return hash;
}
