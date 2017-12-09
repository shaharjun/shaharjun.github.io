function isValidMessage(message) {
    var i = 0,
        messageLength = message.length,
        isValid = true;
    for (i = 0; i < messageLength; i++) {
        if (message[i] != ' ')
            break;
    }
    console.log(messageLength);
    if (i >= messageLength) {
        isValid = false;
    }
    return isValid;
}

function sendChat(index) {
    var message = $('#chatBox').val();
    var message1 = "acknowledged";
    var star = "<i onclick='makeGold()' style='color: burlywood' class='fa fa-star starmsg' aria-hidden='true'></i>"
    var html = "<li class='replies'>" +
        "<img src='images/profile.png' alt='' />" +
        "<p style=\"word-wrap: break-word;\">" + message + "</p></li>";
    var receivedMessage = "<li class='sent'>" +
        "<img src='images/profile.png' alt='' />" +
        "<p  onclick='showStar()' style=\"word-wrap: break-word;\">" + message1 + "</p>"+star+"</li>";
    var isValid = isValidMessage(message);
    if (isValid) {
        $('#messages ul').append(html);
        $('#messages ul').append(receivedMessage);
        storeChat(index, message, 0);
        storeChat(index, message1, 1);
    }
    $('#chatBox').val(' ');
    //scroll to bottom
    scrollToBottom("messages");
}
function logout() {
    window.location.href = "login.html";
    localStorage.removeItem("pratChatToken");
}
function random(){
	$('#addreminder').modal();
}
function searchContact(){
	var text = $("#searchText").val();
	console.log(text);
}
$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });
function showContactProfile() {
    $('#cprof').css('z-index', '300');
    $('#chat').css('position', 'absolute');
    $('#chat').css('z-index', -1);
}
function backHome() {
    $('#cprof').css('z-index', '-1');
    $('#chat').css('position', 'relative');
    $('#chat').css('z-index', '300');
    $('#stardisplay').css('z-index', '-1');
}

function currentContact(str) {
    $('#chat p').html(str);
    $('.contact-profile').css("visibility", "visible");
    $('.message-input').css("visibility", "visible");
    $('#userNameValue').html(str);
    //further code needs to be added here to change email id and phone 
    window.setTimeout(function(){ scrollToBottom("messages"); }, 1);
    $('.contact-profile').click(function(){
        $('#cprof').css('z-index', '300');
        $('#chat').css('position', 'absolute');
        $('#chat').css('z-index', -1);
    });
}
$(document).ready(function() {
    var currentContactIndex = 0;
    var userName="";
    userName=localStorage.getItem("pratChatFullName");
    email=localStorage.getItem("pratChatEmail");
    phoneNo=localStorage.getItem("pratChatPhone");
    $("#profile > div > p").html(userName);
    $('#expanded > ul > li:nth-child(1)').html("Name : "+ userName);
    $('#expanded > ul > li:nth-child(2)').html("Email : "+email);
    $('#expanded > ul > li:nth-child(3)').html("Phone : "+phoneNo);
    setContacts();
    var allContacts=[]
    allContacts=getAllContacts();
    displayAllContacts(allContacts);

    $('#sb').click(function() {
        sendChat(currentContactIndex);
    });
    if ("pratChatToken" in localStorage) {
        console.log("Access Allowed");
    } else {
        console.log("Access Denied, redirecting to Login");
        window.location.href = "login.html";
    }
    $('.contact').click(function() {
        var str = $('p', this).html();
        currentContactIndex = $(this).index();
        console.log(currentContactIndex);
        currentContact(str);
        getChatMessages(currentContactIndex);
        var sent = 0;
        //setInterval(function () {    
            var d = new Date()  ;
            console.log(d);
            var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
            console.log(datestring);
            if(d.getDate() >= 8 && sent === 0)
            {
                  getremainderChat(0);
                  sent = 1;
            }  
          })
          $('#addrem').click(function() {
            sendremainderChat(0);
        //});


    });
    $(".expand-button").click(function() {
        $("#profile").toggleClass("expanded");
        $("#contacts").toggleClass("expanded");
    });
    $('#logout-button').click(function() {
        localStorage.removeItem("pratChatToken");
        window.location.href = "login.html";
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

        if ($("#status-online").hasClass("active")) {
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
    $('.modal').modal();

});

// scroll to bottom
function scrollToBottom(id){
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function storeChat(currentContactIndex, message, messageType) {
    var messageData = {
        'contactIndex': 0,
        'messageText': "",
        'messageType': 0
    }
    var messages = localStorage.getItem("messages");
    messageData.contactIndex = currentContactIndex;
    messageData.messageText = message;
    messageData.messageType = messageType;
    if (messages == null) {
        messages = [];
        console.log(messages);
        messages.push(messageData);
        messages = JSON.stringify(messages);
        localStorage.setItem("messages", messages);
    } else {
        var messagesArray = [];
        messagesArray = localStorage.getItem("messages");
        messagesArray = JSON.parse(messagesArray);
        messagesArray.push(messageData);
        messagesArray = JSON.stringify(messagesArray);
        localStorage.setItem("messages", messagesArray);
    }
}

function getChatMessages(index) {
    var messages = localStorage.getItem("messages");
    var star = "<i onClick='makeGold()' style='color: burlywood' class='fa fa-star starmsg' aria-hidden='true'></i>"
    if (messages != null) {
        var messagesArray = [];
        messagesArray = localStorage.getItem("messages");
        messagesArray = JSON.parse(messagesArray);
        var allMessages = "";
        for (var i = 0; i < messagesArray.length; i++) {
            if (messagesArray[i].contactIndex == index && messagesArray[i].messageType == 0) {
                allMessages += "<li class='replies'>" +
                    "<img src='images/profile.png' alt='' />" +
                    "<p style=\"word-wrap: break-word;\">" + messagesArray[i].messageText + "</p></li>";
            } else if (messagesArray[i].contactIndex == index) {
                allMessages += "<li class='sent'>" +
                    "<img src='images/profile.png' alt='' />" +
                    "<p onclick='showStar()' style=\"word-wrap: break-word;\">" + messagesArray[i].messageText + "</p>"+ star + "</li>";
            }
        }
        $('#messages ul').html(allMessages);
    }
}
function makeGold(){
    $(event.currentTarget).css('color','gold');
    var ind = $(event.currentTarget).parent().index();
    var text = $(event.currentTarget).parent().children('p').text() + ind;
    storeStarMsg(text);
}
function showStar() {
    var str = $(event.currentTarget).text();
    var star = $(event.currentTarget).parent().children('i');
    $(star).css('visibility','visible');
}
function storeStarMsg(text) {
    var starredMessage = {
        'from': ' ',
        'messageText': ' ',
        'to':  ' '
    }
    starredMessage.from = 'sender';
    starredMessage.to = 'recevier';
    starredMessage.messageText = text;
    var store = localStorage.getItem('starredMessages');
    if(store == null) {
        store = [];
        store.push(starredMessage);
        store = JSON.stringify(store);
        localStorage.setItem('starredMessages',store);
    }
    else {
        var starArray = [];
        starArray = localStorage.getItem("starredMessages");
        starArray = JSON.parse(starArray);
        starArray.push(starredMessage);
        starArray = JSON.stringify(starArray);
        localStorage.setItem("starredMessages", starArray);
    }
}
function getAllContacts(){
  allContacts=localStorage.getItem("chatContacts");
  if(allContacts!=null){
    var allContactsList=[];
    allContactsList=JSON.parse(allContacts);
    return allContactsList;
  } 
  return null;
}

function displayAllContacts(allContacts){
  if(allContacts!=null){
     var allContactsString="";
     for(var i=0;i<allContacts.length;i++){
       allContactsString+= '<li class="contact"><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />'
			   +'<div class="meta"><p class="name">'+allContacts[i].fullName+'</p></div></div></li>';
     }
  }
  $('#contacts > ul').html(allContactsString);
}

function setContacts(){
  var contactsList=[];
  localStorage.setItem("pratChatId",0);
  for(var i=1;i<110;i++){
  var contact={'fullName':"",
               'email':"",
               'id':0,
               'phoneNo':0};
    contact.fullName="Contact_"+i;
    contact.email="Contact_"+i+"@gmail.com";
    contact.id=i;
    contact.phoneNo=9818102770+i;
    contactsList.push(contact);
    console.log(contact);
    console.log(contactsList);
 }          
 contactsList=JSON.stringify(contactsList);
 console.log(contactsList);
 localStorage.setItem("chatContacts",contactsList);
}
function showStarred(){
    $('#stardisplay').css('z-index', '400');
    displayStarred();
}
function displayStarred(){
    var messages = localStorage.getItem("starredMessages");
    if (messages != null) {
        var messagesArray = [];
        messagesArray = localStorage.getItem("starredMessages");
        messagesArray = JSON.parse(messagesArray);
        var allMessages = "";
        for (var i = 0; i < messagesArray.length; i++) {
            var from = messagesArray[i].from;
            var msg = messagesArray[i].messageText;
            msg = msg.replace(/[0-9]/g, '');
            allMessages += "<li class='sent'><img src='images/profile.png' alt='' />" +
            "<p style='word-wrap: break-word;'>" +
            msg + 
            "<br><br><span style='float:right; color: darkgray; font-size: 1em'>" +
            from + 
            "</span></p></li>";
            }
        $('#starmessages ul').html(allMessages);
    }
}
function sendremainderChat(index) {
    var message = $('#remaindermessage').val();
    var reminderDate = $('#remainderdate').val();
    console.log(reminderDate);
  //  alert(reminderDate.slice(-17))
    var reminderContact= $('#remindercontact').val();
    var isValid = isValidMessage(message);
    if (isValid) {
        storereminder(index, message, reminderDate,reminderContact,0);
       
    }
    scrollToBottom("messages");
}

function storereminder(currentContactIndex, message, reminderDate,reminderContact,messageType) {
    var messageData = {
        'contactIndex': 0,
        'messageText': "",
        'reminderDate': "",
        'reminderContact': "",
        'messageType': 0
    }
    var remindermessages = localStorage.getItem("remindermessages");
//    messageData.contactIndex = currentContactIndex;
    messageData.messageText = message;
    messageData.reminderDate = reminderDate;
    messageData.reminderContact = reminderContact;
    messageData.messageType=messageType;
   
    if (remindermessages == null) {
        remindermessages = [];
        remindermessages.push(messageData);
        remindermessages = JSON.stringify(remindermessages);
        localStorage.setItem("remindermessages", remindermessages);
    } else {
        var remindermessagesArray = [];
        remindermessagesArray = localStorage.getItem("remindermessages");
        console.log(messageData);
        remindermessagesArray = JSON.parse(remindermessagesArray);
        remindermessagesArray.push(messageData);
        remindermessagesArray = JSON.stringify(remindermessagesArray);
        localStorage.setItem("remindermessages", remindermessagesArray);
    }
}

function getremainderChat(index) {
    var messages = localStorage.getItem("remindermessages");
   
   // console.log(index);
    if (messages != null) {
        var remindermessagesArray = [];
        remindermessagesArray = localStorage.getItem("remindermessages");
        console.log(remindermessagesArray);
        remindermessagesArray = JSON.parse(remindermessagesArray);
      
        var allMessages = "";
        //var date = new Date();
       // if (date.getDate()=== 8 && sent === 0 ) {
        for (var i = 0; i < remindermessagesArray.length; i++) {
        	//console.log(remindermessagesArray[i]);
            if (remindermessagesArray[i].contactIndex == 0 && remindermessagesArray[i].messageType == 0) {
                var str = $('p', '0').html();
                currentContactIndex = $('0').index();
               // console.log(currentContactIndex);
                currentContact(str);
                allMessages += "<li class='replies'>" +
                    "<img src='images/profile.png' alt='' />" +
                    "<p style=\"word-wrap: break-word;\">" + remindermessagesArray[i].messageText + "</p></li>";
            	
            } 
            remindermessagesArray[i].messageType = 1;
            console.log(remindermessagesArray[i].messageType);
        }
      remindermessagesArray = JSON.stringify(remindermessagesArray);
      localStorage.setItem("remindermessages", remindermessagesArray);
       // console.log(allMessages);
        $('.messages ul').html(allMessages);
    }
}
