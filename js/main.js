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
    var star = "<i style='color: burlywood;' onclick='storeStarMsg(message)' class='fa fa-star starmsg' aria-hidden='true'></i>"
    var html = "<li class='replies'>" +
        "<img src='images/profile.png' alt='' />" +
        "<p style=\"word-wrap: break-word;\">" + message + "</p></li>";
    var receivedMessage = "<li class='sent'>" +
        "<img src='images/profile.png' alt='' />" +
        "<p style=\"word-wrap: break-word;\">" + message1 + "</p>"+star+"</li>";
    var isValid = isValidMessage(message);
    if (isValid) {
        $('.messages ul').append(html);
        $('.messages ul').append(receivedMessage);
        storeChat(index, message, 0);
        storeChat(index, message1, 1);
    }
    $('#chatBox').val(' ');
    //scroll to bottom
    scrollToBottom("messages");
}
function storeStarMsg(){
    $('.starmsg').attr('style', 'color:gold');
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
    var allContacts=getAllContacts();
    displayAllContacts(allContacts);

    $('#sb').click(function() {
        sendChat(currentContactIndex);
    });
    $(window).on('keydown', function(e) {
        if (e.which == 13) {
            sendChat(currentContactIndex);
            return false;
        }
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
                    "<p style=\"word-wrap: break-word;\">" + messagesArray[i].messageText + "</p></li>";
            }
        }
        $('.messages ul').html(allMessages);
    }
}
function getAllContacts(){
  
}
function displayAllContacts(){
}
function showStarred(){
    $('#stardisplay').css('z-index', '400');
}
function getStarred() {
    var starMsg = localStorage.getItem("starredMessages");
    if (starMsg != null) {
        var messagesArray = [];
        messagesArray = localStorage.getItem("starredMessages");
        messagesArray = JSON.parse(messagesArray);
    }
    var allMessages = "";
    for(var i = 0; i<messagesArray.length; i++){
        allMessages += "" + messagesArray[i].messageText +"";
    }
    $('.messages ul').html(allMessages);
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
        $('.messages ul').html(allMessages);
    }
}

