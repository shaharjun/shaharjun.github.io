
pollId=0;
responseId=0;

var pollCount=0;
var pollFieldCount =0;
var sendReceiver=[];
var pollData ={
		
				"polledChatMessageId" : 0,
					"userId" : 0,
					"polledChatMessageText" : "",
					"createdOn" :"12/12/2017",
					"polledChatStatus" : "SENT",
					"starred" : false,
					"chatType" : "POLLED", 
					"users" : [{"receiverUserId" : "", 
								"receiverEmailId" : "",
								"polledResponseId" : 0,
								"polledResponseDate" : "",
								"polledResponse": ""}],
					"expirationDate" : "",
					"polledResponseDate" : "",
					"polledResponseType" : ["Yes","No","Cant Say"],
					"pollYesCount":0,
					"pollNoCount":0,
					"pollCantSayCount":0,
			
}

var field=0  ;            
var max_fields      = 4; //maximum CONTACTS allowed



$(function () {


	$("#popUp_1").hide();
	$("#demo").hide();
	
    displayData();
    
    $("#create").click(function(){
		$("#pollContactCreate").hide();
		$("#popUp_1").toggle();
		pollsearchUser();
    })
    $("#closePoll").click(function(){
    	$("#popUp_1").hide();
    })
    $("#sendPoll").click(function(){
    	sendPoll();
    })
   
    $(".submit").click(function(){
		console.log(this.id);
		
    	sendResponse(this.id);
   	
    })
    var wrapper = $("#contactForPoll"); //Fields wrapper
    var x = 1; //initial text box count
    $("#addPollContact").click(function(e){ //on add input button click
		$("#pollContactCreate").show()
		e.preventDefault();
        if(x < 2){ //max input box allowed
            //text box increment
            $(wrapper).append('<div><input type="text" name="mytext[]" id='+'addContactPoll'+x+' /><a href="#" class="remove_field">Remove</a></div>'); //add input box
			x++;
			
		}
    });
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
    
});    



function displayData(){
	displayQuestions();
}

function sendPoll(){
	pollData.polledChatMessageText=$('#questionPoll').val();
	//pollFieldCount = $('.input_fields_wrap').find('input');
	for (var i = 1; i <= field; i++){
		var user ={"receiverUserId" : "", "receiverEmailId" : "","polledResponseId" : 0,
		"polledResponseDate" : "",
		"polledResponse": ""};
		
		if(sendReceiver != null || sendReceiver != undefined) {
			console.log(sendReceiver[i-1])
			user.receiverEmailId=sendReceiver[i-1];
			pollData.users[i-1]=user;
		}
	}
	
    var pollArray=localStorage.getItem("polledMessage");
    if(pollArray==null){
    	console.log(1)
    	pollArray=[];
    	pollArray.push(pollData);
    	pollArray=JSON.stringify(pollArray);
    	localStorage.setItem("polledMessage", pollArray);
    }
    else{
    	var pollArray=[];
    	pollArray=localStorage.getItem("polledMessage");
    	pollArray=JSON.parse(pollArray);
    	pollArray.push(pollData);
    	pollArray=JSON.stringify(pollArray);
    	localStorage.setItem("polledMessage", pollArray);
    }
	console.log(pollData);
}

function displayQuestions() {
	$("#questions").empty();
	
	var Polldisplay=localStorage.getItem("polledMessage");
	Polldisplay=JSON.parse(Polldisplay);
	var str="";
	$.each(Polldisplay,function(i,poll){
		
		if(poll.polledResponseUserId==null)
			{
			str+="<div class='row col s12'>";
			str+='<ul id=' + "poll"+i;
			str+=' class="collapsible" data-collapsible="accordion">'
			str+="<li>";
			str+="<div class='collapsible-header'>"
			str+=poll.polledChatMessageText;
			str+="</div>"
			str+="<div class='collapsible-body'><span><p>"; 
			str+=poll.polledChatMessageText;
			str+="</p><br>";
			str+="<form>";
			str+="<input name="+ "group"+i ;
			str+=" type='radio' id=" +"test1"+i
			str+=" value='yes'/>";
			str+="<label for="+ "test1"+i
			str+=">" +poll.polledResponseType[0] +  "<div class='chip' style='float:right'>" ;
			str+=poll.pollYesCount +"</div></label><br>";
			str+="<input name=" +"group"+i;
			str+=" type='radio' id=" +"test2"+i
			str+=" value='no'/>";
			str+="<label for="+"test2"+i;
			str+=">" +poll.polledResponseType[1] +"<div class='chip' style='float:right'>";
			str+=poll.pollNoCount +"</div></label><br>";
			str+="<input name=" +'group'+i;
			str+=" type='radio' id=" +"test3"+i;
			str+=" value='cantSay'/>";
			str+="<label for=" +"test3"+i;
			str+="> "+poll.polledResponseType[2] +"<div class='chip' style='float:right'>";
			str+=poll.pollCantSayCount +"<br></div></label>";
			str+="<input type='button' class='submit' id=" +i
			str+=" value='Submit Poll'/>";
			str+="</form>"
		    str+="</span></div>";
			str+="</li>"
			str+="</ul></div>"
		}
	});
	$("#questions").append(str);
}

function sendResponse(x) {
	console.log(x);
	var radioValue = $("input[name=" + 'group' + x + "]:checked").val();
	console.log(radioValue);
		
	var pollSendResponse=localStorage.getItem("polledMessage");
	pollSendResponse=JSON.parse(pollSendResponse);
	
	// $("#11").html(pollSendResponse[x].pollYesCount)
	// $("#22").html(pollSendResponse[x].pollNoCount)
	// $("#33").html(pollSendResponse[x].pollCantSayCount)
	
	var thisUser=localStorage.getItem("thisUser");
	thisUser=JSON.parse(thisUser);
	console.log(thisUser.emailId)
	for(var i=0;i<pollSendResponse[x].users.length;i++){
		if(pollSendResponse[x].users[i].receiverEmailId==thisUser.emailId){
			if(pollSendResponse[x].users[i].polledResponse=null){
				if(radioValue=="yes"){
					pollSendResponse[x].pollYesCount++;
					console.log(pollSendResponse[x].pollYesCount);
				}
				else if(radioValue=="no"){
					pollSendResponse[x].pollNoCount++;
				}
				else {
					pollSendResponse[x].pollCantSayCount++;
				}
				pollSendResponse[x].users[i].polledResponse=radioValue;
			}	
		
		}
	}
		
	
	console.log(pollSendResponse);
	pollSendResponse = JSON.stringify(pollSendResponse);
	localStorage.setItem("polledMessage", pollSendResponse);
	location.reload();
}

function pollIdGenerator() {
	return pollId++;

}

function responseIdGenerator() {
	return responseId++;
}








function pollDisplaySearchUserResult(searchResult) {
	//searchResult is a set we get from searchUser function
	console.log("hii")
    var listElement = $("#psearchUserResultList");
    if (searchResult != null) {
        var resultString = "";
        searchResult.forEach(function (value, key, setObj) {
            var userName = value["fullName"];
            var emailId = value["emailId"];
            resultString += "<div><li ><div class=\"inlineDisplay\"><img  class=\"imageSearchUser\" src = \"images/profile.png\" alt=\"\" /></div>" + "<div class=\"inlineDisplay userDetailsSearchUser\" >";
            resultString += userName + "<br>" + emailId + "</div><i data-mail=" + emailId + " onclick=\"pollContactToDisplay()\" class=\" addButton material-icons\">add</i></li></div><br>";
        })
	}
    listElement.html(resultString);
}
var dis=[];
function pollContactToDisplay(){
	var flag=0;
	var emailId = $(event.currentTarget).data("mail");
    var users = JSON.parse(localStorage.getItem("chatContacts"));
    var contact = users[emailId];
	name = contact.fullName;
	for(var i=0;i<dis.length;i++){
		if(dis[i]==""+name+"("+emailId+")")
			flag=1;
	}
	if(flag==0){
	 dis.push (""+name+"("+emailId+")");
	field++;
	sendReceiver.push(emailId);
	console.log(sendReceiver);
	}
     $("#addContactPoll1").val(dis);
	 //$("#getcontact").val(emailId);
	
	 //$("#pollContactCreate").hide();
	 
	 if(field==max_fields)$("#pollContactCreate").hide();
}
   
   

function pollsearchUser() {
    var i = 0,
        numberOfUsers, currentContact;
    var result = new Set();
    var allContacts = JSON.parse(localStorage.getItem("chatContacts"));
    for (var key in allContacts) {
        if (allContacts.hasOwnProperty(key)) {
            var currentContact = allContacts[key]; //this is the user object
            var currentContactUserName = currentContact["fullName"];
            var currentContactEmailId = currentContact["emailId"];
            currentContactUserName = currentContactUserName.toLowerCase();
            currentContactEmailId = currentContactEmailId.toLowerCase();
            result.add(currentContact);
    }
}
    console.log(allContacts);
    pollDisplaySearchUserResult(result);

}