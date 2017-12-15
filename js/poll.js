pollId=0;
responseId=0;

var pollCount=0;

var pollData ={
		
				"polledChatMessageId" : 0,
					"userId" : 0,
					"polledChatMessageText" : "",
					"createdOn" :"12/12/2017",
					"polledChatStatus" : "SENT",
					"starred" : false,
					"chatType" : "POLLED", 
					"users" : [{"receiverUserId" : "", "receiverEmailId" : ""}],
					"expirationDate" : "",
					"polledResponseUserId" : null,
					"polledResponseId" : 0,
					"polledResponseDate" : "",
					"polledResponseType" : ["Yes","No","Cant Say"],
					"pollYesCount":0,
					"pollNoCount":0,
					"pollCantSayCount":0,
			
}

               
var max_fields      = 4; //maximum CONTACTS allowed


$(function () {

	
	$("#popUp_1").hide();
	$("#demo").hide();
	
    displayData();
    
    $("#create").click(function(){
    	$("#popUp_1").toggle();
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
    var wrapper = $(".input_fields_wrap"); //Fields wrapper
    var x = 1; //initial text box count
    $("#addPollContact").click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input type="text" name="mytext[]" id='+'addContactPoll'+x+' /><a href="#" class="remove_field">Remove</a></div>'); //add input box
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
	var pollFieldCount = $('.input_fields_wrap').find('input');
	for (var i = 1; i <= pollFieldCount.length; i++){
		var user ={"receiverUserId" : "", "receiverEmailId" : ""};
		var pollFieldValue = $("#addContactPoll"+i).val();
		console.log(pollFieldValue);
		if(pollFieldValue !== null || pollFieldValue !== undefined) {
			
			user.receiverUserId=pollFieldValue;
			pollData.users[i-1]=user;
		}
	}
	console.log(pollData)
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
function displayQuestions(){
	$("#questions").empty();
	
	var Polldisplay=localStorage.getItem("polledMessage");
	Polldisplay=JSON.parse(Polldisplay);
	var str="";
	$.each(Polldisplay,function(i,poll){
		console.log(poll)
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
			str+=">" +poll.polledResponseType[2] +"<div class='chip' style='float:right'>";
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

function sendResponse(x){
	console.log(x);
	var radioValue = $("input[name=" +'group'+x+"]:checked").val();
	console.log(radioValue);
	var pollSendResponse=localStorage.getItem("polledMessage");
	pollSendResponse=JSON.parse(pollSendResponse);
	if(radioValue=="yes"){
		pollSendResponse[x].pollYesCount++;
		console.log(pollSendResponse[x].pollYesCount);
	}
	else if(radioValue=="no"){
		pollSendResponse[x].pollNoCount++;
	}
	else 	{
		pollSendResponse[x].pollCantSayCount++;
	}
	
	console.log(pollSendResponse);
	pollSendResponse = JSON.stringify(pollSendResponse);
    localStorage.setItem("polledMessage", pollSendResponse);
}
function pollIdGenerator(){
	return pollId++;
	
}
function responseIdGenerator(){
	return responseId++;
}
