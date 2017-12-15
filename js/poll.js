
pollId=0;
responseId=0;

var pollCount=0;
var pollFieldCount =0;
var sendReceiver=[];
var pollData ={
		
				"polledChatMessageId" : 0,
					"userId" : 0,
					"polledChatMessageText" : "",
					"createdOn" :new Date(),
					"polledChatStatus" : "SENT",
					"starred" : false,
					"chatType" : "POLLED", 
					"users" : [{"receiverUserId" : "", 
								"receiverEmailId" : "",
								"polledResponseId" : 0,
								"polledResponseDate" : "",
								"polledResponse": "nil",
								}],
					"expirationDate" : "",
					"polledResponseType" : ["Yes","No","Cant Say"],
					"pollYesCount":0,
					"pollNoCount":0,
					"pollCantSayCount":0,
}




var field=0  ;            
var max_fields      = 4; //maximum CONTACTS allowed



$(function () {

    var id=0;
	firebase.database().ref('idGenerator/pollId').once('value').then(function (snapshot) {
			id=snapshot.val();
			++id;
			firebase.database().ref('idGenerator').update({'pollId' : id});
			console.log(id);
			
			
			});
	
	
	
	
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
   
    $(".sub").click(function(){
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

	for (var i = 1; i <= field; i++){
		var user ={"receiverUserId" : "", "receiverEmailId" : "","polledResponseId" : 0,
		"polledResponseDate" : "",
		"polledResponse": "nil"};
		
		if(sendReceiver != null || sendReceiver != undefined) {
			console.log(sendReceiver[i-1])
			user.receiverEmailId=sendReceiver[i-1];
			pollData.users[i-1]=user;
		}
	}
	
	
	var pollArray=getLocalStorage("polledMessage");
    //var pollArray=localStorage.getItem("polledMessage");
    if(pollArray==null){
    	console.log(1)
    	pollArray=[];
    	pollArray.push(pollData);
   
		setLocalStorage("polledMessage", pollArray)
    }
    else{
		var pollArray=[];
		pollArray=getLocalStorage("polledMessage");
    	
    	pollArray.push(pollData);
    
		setLocalStorage("polledMessage", pollArray)
    }
	console.log(pollData);
}

function displayQuestions() {
	$("#questions").empty();
	var Polldisplay=getLocalStorage("polledMessage");
	
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
			str+="<input type='button' class='sub' id=" +i
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
	
	var pollSendResponse=getLocalStorage("polledMessage");
	
	var thisUser=getLocalStorage("thisUser");
	
	
	for(var i=0;i<pollSendResponse[x].users.length;i++){
		if(pollSendResponse[x].users[i].receiverEmailId==thisUser.emailId){
			console.log(pollSendResponse[x].users[i].polledResponse)
			console.log(pollSendResponse[x].users[i].polledResponse=="nil")
			if(pollSendResponse[x].users[i].polledResponse=="nil"){
				console.log("entered")
				if(radioValue=="yes"){
					pollSendResponse[x].pollYesCount++;
					console.log(radioValue)
				}
				else if(radioValue=="no"){
					pollSendResponse[x].pollNoCount++;
					console.log(radioValue)
				}
				else {
					pollSendResponse[x].pollCantSayCount++;
					console.log(radioValue)
				}
				pollSendResponse[x].users[i].polledResponse=radioValue;
			}	
		
		}
	}
		
	
	console.log(pollSendResponse);
	setLocalStorage("polledMessage", pollSendResponse)
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
	var users=getChatContacts();
    
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
	
	 
	 if(field==max_fields)$("#pollContactCreate").hide();
}
   
   

function pollsearchUser() {
    var i = 0,
        numberOfUsers, currentContact;
	var result = new Set();
	var allContacts=getChatContacts();
    //var allContacts = JSON.parse(localStorage.getItem("chatContacts"));
    for (var key in allContacts) {
        
            var currentContact = allContacts[key]; //this is the user object
            var currentContactUserName = currentContact.fullName;
            var currentContactEmailId = currentContact.emailId;
            result.add(currentContact);
    }

    console.log(allContacts);
    pollDisplaySearchUserResult(result);

}


