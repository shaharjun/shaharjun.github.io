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

    var sentMessage = {
        'creator': '',
        'receiver': '',
        'chatMessageId': 0,
        'createdOn': new Date(),
        'starred': false,
        'contactIndex': 0,
        'chatMessageText': '',
        'messageType': 0,
        'chatStatus': '',
        'chatType': ''
    };
    sentMessage.chatMessageText = $('#chatBox').val();
    var receivedMessage = {
        'creator': '',
        'receiver': '',
        'chatMessageId': 0,
        'createdOn': new Date(),
        'starred': false,
        'contactIndex': 0,
        'chatMessageText': '',
        'messageType': 1,
        'chatStatus': '',
        'chatType': ''
    };
    receivedMessage.chatMessageText = 'hmm';
    var star = "<i onclick='makeGold()' style='color: burlywood' class='fa fa-star starmsg' aria-hidden='true'></i>"
    var html = "<li class='replies'>" +
        "<img src='images/profile.png' alt='' />" +
        "<p style=\"word-wrap: break-word;\">" + sentMessage.chatMessageText + "</p></li>";
    var rcMessage = "<li class='sent'>" +
        "<img src='images/profile.png' alt='' />" +
        "<p  onclick='showStar()' style=\"word-wrap: break-word;\">" + receivedMessage.chatMessageText + "</p>" + star + "</li>";
    var isValid = isValidMessage(sentMessage.chatMessageText);
    if (isValid) {
        $('#messages ul').append(html);
        $('#messages ul').append(rcMessage);
        storeChat(index, sentMessage);
        storeChat(index, receivedMessage);
    }
    $('#chatBox').val(' ');
    //scroll to bottom
    scrollToBottom("messages");
}

function logout() {
    window.location.href = "login.html";
    localStorage.removeItem("sessionId");
}

function random() {
    $('#addreminder').modal();
}

function searchContact() {
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

function currentContact(str) {
    $('#chat p').html(str);
    $('#cprof #userNameValue').html(str);
    /* $("#chat").css('z-index',10); */
    bringToTop($("#chat"));
    $("#background").css('z-index', -10);
    //further code needs to be added here to change email id and phone 
    window.setTimeout(function() { scrollToBottom("messages"); }, 1);
    $('.contact-profile').click(function() {
        /* $('#cprof').css('z-index', 10);
        $('#chat').css('position', 'absolute');
        $('#chat').css('z-index', -10); */
        bringToTop($("#cprof"));
    });
}

$(document).ready(function() {
    var currentContactIndex = 0;
    var user = {
        'fullName': '',
        'emailId': '',
        'userId': 0,
        'password': '',
        'phoneNo': 0,
        'profilePictureURL': '',
        'chatContacts': []
    };
    // ab honga dangal
    user = JSON.parse(localStorage.getItem("thisUser"));
    userName = user.fullName;
    email = user.emailId;
    phoneNo = user.phoneNo;

    //set uprof and eprof values
    $("#uprof #userNameValue").html(userName);
    $("#uprof #userEmailValue").html(email);
    $("#uprof #userPhoneValue").html(phoneNo);
    $("#eprof #userNameValue").html(userName);
    $("#eprof #userEmailValue").html(email);
    $("#eprof #userPhoneValue").html(phoneNo);

    $("#profile > div > p").html(userName);
    $('#expanded > ul > li:nth-child(1)').html("Name : " + userName);
    $('#expanded > ul > li:nth-child(2)').html("Email : " + email);
    $('#expanded > ul > li:nth-child(3)').html("Phone : " + phoneNo);
    setContacts();
    var allContacts = []
    allContacts = getAllContacts();
    displayAllContacts(allContacts);

    $('#sb').click(function() {
        sendChat(currentContactIndex);
    });
    if ("sessionId" in localStorage) {
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
        localStorage.removeItem("sessionId");
        window.location.href = "login.html";
    });
    $("#profile-img").click(function() {
        $("#status-options").addClass("active");
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

    $("#myProfileOuterDiv").click(function() {
        bringToTop($("#uprof"));
    });
    $(document).bind("mouseup touchend", function(e) {
        if (e.target.id != "profile-img") {
            $("#status-options").removeClass("active");
        }
    });
});

// scroll to bottom
function scrollToBottom(id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function storeChat(currentContactIndex, message) {
    var messageData = {
        'creator': '',
        'receiver': '',
        'chatMessageId': 0,
        'createdOn': new Date(),
        'starred': false,
        'contactIndex': 0,
        'chatMessageText': '',
        'messageType': 0,
        'chatStatus': '',
        'chatType': ''
    };
    var numItem = $('#contacts > ul > li.contact.request').length;
    currentContactIndex = currentContactIndex - numItem;
    var messages = localStorage.getItem("messages");
    messageData.contactIndex = currentContactIndex;
    messageData.chatMessageText = message.chatMessageText;
    messageData.messageType = message.messageType;
    if (messages == null) {
        messages = [];
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
    var numItem = $('#contacts > ul > li.contact.request').length;
    var allMessages = " ";
    console.log(numItem);
    if (numItem != 0 && index < numItem) {
        var rq = localStorage.getItem("requests");
        rq = JSON.parse(rq);
        var item = rq[index];
        var msg = '<li class="sent"><img src="images/profile.png" alt="">' +
            '<p>' + item.creator + ' wants to connect with you</p>' +
            '&nbsp<i onClick="approveRequest(' + index + ')" style="font-size:2em;color:seagreen" class="fa fa-check-circle" aria-hidden="true"></i>' +
            '&nbsp&nbsp<i onClick="removeRequest(' + index + ')" style="font-size:2em;color:indianred" class="fa fa-times" aria-hidden="true"></i></li>';
        $('#messages ul').html(msg);
        $('.message-input').css('visibility', 'hidden');
    } else {
        index = index - numItem;
        $('.message-input').css('visibility', 'visible');
        var messages = localStorage.getItem("messages");
        var star = "<i onClick='makeGold()' style='color: burlywood' class='fa fa-star starmsg' aria-hidden='true'></i>"
        if (messages != null) {
            var messagesArray = [];
            messagesArray = localStorage.getItem("messages");
            messagesArray = JSON.parse(messagesArray);
            for (var i = 0; i < messagesArray.length; i++) {
                if (messagesArray[i].contactIndex == index && messagesArray[i].messageType == 0) {
                    allMessages += "<li class='replies'>" +
                        "<img src='images/profile.png' alt='' />" +
                        "<p style=\"word-wrap: break-word;\">" + messagesArray[i].chatMessageText + "</p></li>";
                } else if (messagesArray[i].contactIndex == index && messagesArray[i].messageType == 1) {
                    allMessages += "<li class='sent'>" +
                        "<img src='images/profile.png' alt='' />" +
                        "<p onclick='showStar()' style=\"word-wrap: break-word;\">" + messagesArray[i].chatMessageText + "</p>" + star + "</li>";
                }
            }
        }
        $('#messages ul').html(allMessages);
    }
}

function makeGold() {
    $(event.currentTarget).css('color', 'gold');
    var ind = $(event.currentTarget).parent().index();
    var text = $(event.currentTarget).parent().children('p').text() + ind;
    storeStarMsg(text);
}

function showStar() {
    var str = $(event.currentTarget).text();
    var star = $(event.currentTarget).parent().children('i');
    $(star).css('visibility', 'visible');
}

function storeStarMsg(msgObj) {
    var starredMessage = {
        'creator': '',
        'receiver': '',
        'chatMessageId': 0,
        'createdOn': new Date(),
        'starred': false,
        'contactIndex': 0,
        'chatMessageText': '',
        'messageType': 0,
        'chatStatus': '',
        'chatType': ''
    };
    starredMessage.chatMessageText = msgObj;
    starredMessage.starred = true;
    var store = localStorage.getItem('starredMessages');
    if (store == null) {
        store = [];
        store.push(starredMessage);
        store = JSON.stringify(store);
        localStorage.setItem('starredMessages', store);
    } else {
        var starArray = [];
        starArray = localStorage.getItem("starredMessages");
        starArray = JSON.parse(starArray);
        starArray.push(starredMessage);
        starArray = JSON.stringify(starArray);
        localStorage.setItem("starredMessages", starArray);
    }
}

function getAllContacts() {
    allContacts = localStorage.getItem("chatContacts");
    if (allContacts != null) {
        var allContactsList = [];
        allContactsList = JSON.parse(allContacts);
        return allContactsList;
    }
    return null;
}

function displayAllContacts(allContacts) {
    var allContactsString = "";
    var store = localStorage.getItem("requests");
    var request = {
        'creator': 'Arjun',
        'receiver': 'Rajat',
        'chatMessageId': 0,
        'createdOn': new Date(),
        'starred': false,
        'contactIndex': 0,
        'chatMessageText': '',
        'messageType': 2,
        'chatStatus': '',
        'chatType': ''
    }
    var request2 = {
        'creator': 'Utkarsha',
        'receiver': 'Rajat',
        'chatMessageId': 0,
        'createdOn': new Date(),
        'starred': false,
        'contactIndex': 0,
        'chatMessageText': '',
        'messageType': 2,
        'chatStatus': '',
        'chatType': ''
    };
    store = JSON.parse(store);
    if (store == null || store.length == 0) {
        var arr = [];
        arr.push(request);
        arr.push(request2);
        arr = JSON.stringify(arr);
        localStorage.setItem('requests', arr);
    }
    store = localStorage.getItem("requests");
    store = JSON.parse(store);
    for (var i = 0; i < store.length; i++) {
        allContactsString += '<li class="contact request"><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />' +
            '<div class="meta"><p class="name">' + store[i].creator + '</p></div></div></li>';
    }
    if (allContacts != null) {
        for (var i = 0; i < allContacts.length; i++) {
            allContactsString += '<li class="contact"><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />' +
                '<div class="meta"><p class="name">' + allContacts[i].fullName + '</p></div></div></li>';
        }
    }
    $('#contacts > ul').html(allContactsString);
}

function setContacts() {
    var contactsList = [];
    if (!localStorage.getItem("chatContacts")) {
        for (var i = 1; i < 110; i++) {
            var contact = {
                'fullName': '',
                'emailId': '',
                'userId': 0,
                'password': '',
                'phoneNo': 0,
                'profilePictureURL': '',
                'chatContacts': []
            };
            contact.fullName = "Contact_" + i;
            contact.emailId = "Contact_" + i + "@gmail.com";
            contact.userId = i;
            contact.phoneNo = 9818102770 + i;
            contactsList.push(contact);
        }
        contactsList = JSON.stringify(contactsList);
        localStorage.setItem("chatContacts", contactsList);
    }
}

function showStarred() {
    bringToTop($('#stardisplay'));
    displayStarred();
}

function displayStarred() {
    var messages = localStorage.getItem("starredMessages");
    if (messages != null) {
        var messagesArray = [];
        messagesArray = localStorage.getItem("starredMessages");
        messagesArray = JSON.parse(messagesArray);
        var allMessages = "";
        for (var i = 0; i < messagesArray.length; i++) {
            var from = messagesArray[i].creator;
            var msg = messagesArray[i].chatMessageText;
            msg.replace(/[0-9]/g, '');
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

function showEditMyProfile() {
    console.log("Show edit my profile");
    bringToTop($("#eprof"));
}

function bringToTop(object) {
    console.log("bringToTop() Called");
    var divs = ['#cprof', '#background', '#chat', '#uprof', '#eprof', '#stardisplay'];

    for (var i = 0; i < divs.length; i++) {
        $(divs[i]).css('z-index', -10);
    }
    object.css('z-index', 300);
}

function backHomeFromContactProfile() {
    bringToTop($("#chat"));
}

function backHomeFromMyProfile() {
    bringToTop($("#background"));
}

function removeRequest(index) {
    var store = localStorage.getItem("requests");
    store = JSON.parse(store);
    store.splice(index, 1);
    console.log('length' + store.length);
    store = JSON.stringify(store);
    localStorage.setItem("requests", store);
    var el = $('#contacts > ul > li').eq(index)
    el.remove();
    bringToTop($('#background'));
}

function approveRequest(index) {
    var store = localStorage.getItem("requests");
    store = JSON.parse(store);
    var name = store[index].creator;
    store.splice(index, 1);
    console.log('length' + store.length);
    store = JSON.stringify(store);
    localStorage.setItem("requests", store);
    var contact = {
        'fullName': '',
        'emailId': '',
        'userId': 0,
        'password': '',
        'phoneNo': 0,
        'profilePictureURL': '',
        'chatContacts': []
    }
    contact.fullName = name;
    contact.emailId = 'some@mail.com';
    contact.phoneNo = 779121212;
    var contacts = localStorage.getItem("chatContacts");
    contacts = JSON.parse(contacts);
    contact.userId = contacts.length + 1;
    contacts.push(contact);
    contacts = JSON.stringify(contacts);
    localStorage.setItem("chatContacts", contacts);
    var el = $('#contacts > ul > li').eq(index)
    el.remove();
    var html = '<li class="contact"><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />' +
        '<div class="meta"><p class="name">' + name + '</p></div></div></li>';
    $('#contacts > ul').append(html);
    bringToTop($('#background'));
    var $toastContent = $('<span>' + name + ' has been added ' + '</span>').add($('<button onClick="location.reload()" class="btn-flat toast-action">Ok</button>'));
    Materialize.toast($toastContent, 10000);
}