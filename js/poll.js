Polls =new Array();

$(function () {
	$("#popUp_1").hide();
	$("#demo").hide();
	initData();
    displayData();
    $("#create").click(function(){
    	$("#popUp_1").show();
    })
    $("#closePoll").click(function(){
    	$("#popUp_1").hide();
    })

    var max_fields      = 4; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
   
    var x = 1; //initlal text box count
    $("#addPollContact").click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input type="text" name="mytext[]" id="addContactPoll"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
        }
    });
   
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
    
   
    
   $(this).parent("#addContactPoll").keypress(function (e) {
    	 var key = e.which;
    	 if(key == 13)  // the enter key code
    	  {
    	    console.log('aaaaa');
    	  }
    	});   
    
    
    
});    

function initData(){
    initPoll();
}

function displayData(){
	displayQuestions(Polls);
}

var poll=function(_question){
    this.question=_question;
}


function initPoll(){
    var poll1 = new poll("Game on ? Today 7.pm at soccercity");
    var poll2 = new poll("Movie tonight ? Guyss....");
    var poll3 = new poll("Question3");
    var poll4 = new poll("Question4");
    var poll5 = new poll("Question5");
    var poll6 = new poll("Question6");
    Polls.push(poll1);
    Polls.push(poll2);
    Polls.push(poll3);
    Polls.push(poll4);
    Polls.push(poll5);
    Polls.push(poll6);
}  

function displayQuestions(Polldisplay){
	$("#questions").empty();
	var str="";
	$.each(Polldisplay,function(i,poll){
		/*str+="<div class='row'>";*/
		str+="<ul class='collapsible' data-collapsible='accordion'>"
		str+="<li>";
		str+="<div class='collapsible-header'>"
		str+=poll.question
		str+="</div>"
		str+="<div class='collapsible-body'><span>"; 
		str+=poll.question;
		str+="<br>";
		str+="<form>";
		str+="<p><input name='group1' type='radio' id='test1' value='yes'/>";
		str+="<label for='test1'>YES</label></p>";
		str+="<p><input name='group1' type='radio' id='test2' value='no'/>";
		str+="<label for='test2'>NO</label></p>";
		str+="<p><input name='group1' type='radio' id='test3' value='cantSay'/>";
		str+="<label for='test3'>CANT SAY</label></p>";
		str+="<input type='submit' value='Submit Poll'/>";
		str+="</form>"
		      
		str+="</span></div>";
		str+="</li>"
		str+="</ul>"
		
	});
	
	$("#questions").append(str);
	
}
