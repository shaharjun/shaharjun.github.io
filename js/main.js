function isValidMessage(message) {
    var i = 0,
        messageLength = message.length,
        isValid = true;
    for (i = 0; i < messageLength; i++) {
        if (message[i] != ' ')
            break;
    }
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
    profilePicture = user.profilePictureURL;

    //set uprof and eprof values
    $("#uprof #userNameValue").html(userName);
    $("#uprof #userEmailValue").html(email);
    $("#uprof #userPhoneValue").html(phoneNo);
    $('#uprof .display-pic').attr('src', profilePicture);
    $("#eprof #userNameValue").attr('value', userName);
    $("#eprof #userEmailValue").attr('value', email);
    $("#eprof #phone").attr('value', phoneNo);
    $('#eprof #upload-demo').attr('src', profilePicture);

    $('#profile-img').attr('src', profilePicture);

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
    $('#upload-demo').croppie({
        enableExif: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'circle'
        },
        showZoomer : false,
        boundary: {
            width: 300,
            height: 300
        }
    });
    $("#updateProfilePictureBtn").click(function(){
        $('#upload-demo').croppie('result', 'base64').then(function(base64){
            var user = JSON.parse(localStorage.getItem('thisUser'));
            user.profilePictureURL = base64;
            localStorage.setItem("thisUser", JSON.stringify(user));
            Materialize.toast("Profile Picture changed. Please Refresh to see changes.", 4000);
            location.reload();
        });
    });
    $(document).bind("mouseup touchend", function(e) {
        if (e.target.id != "profile-img") {
            $("#status-options").removeClass("active");
        }
    });

    $("#searchUserButton").prop("disabled",true);
    clearSearchBar();
    var contacts = new Map();
    $.getJSON('./contacts.json', function (data) {
    }).done(function(data){
        $.each(data, function (i, contact) {
            // $('ul').append('<li>' + contact.name +'</li>');
            contacts[contact["emailId"]] = contact;
            //console.log(contacts);
        });
     localStorage.setItem("allUsers", JSON.stringify(contacts));
     areContactsLoaded(true);
     $("#searchUserButton").prop("disabled",false);
     $("#searchUserButton").click(function(){    
        searchUser(true);
     });
    })
    .error(function () {
        alert("Data could not be loaded");
    });
    $('#chatBox').keypress(function(event) {
        if (event.keyCode == 13) {
            sendChat();
        }
    });
    $('#updateProfileInfoBtn').click(function(){
        var eUserName = $("#eprof #userNameValue").val();
        var eUserEmail = $("#eprof #userEmailValue").val();
        var eUserPhone = $("#eprof #phone").val();
        user.fullName = eUserName;
        user.emailId = eUserEmail;
        user.phoneNo = eUserPhone;
        localStorage.setItem("thisUser", JSON.stringify(user));
        Materialize.toast("Profile Info changed. Please Refresh to see changes.", 4000);
        location.reload();
    }) 
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
    var msg = {
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
    $(event.currentTarget).css('color', 'gold');
    var ind = $(event.currentTarget).parent().index();
    var text = $(event.currentTarget).parent().children('p').text();
    msg.chatMessageText = text;
    msg.creator = $('.contact-profile > p').text();
    storeStarMsg(msg);
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
    starredMessage = msgObj;
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
        for (var i = 1; i < 10; i++) {
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


function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
            $('#upload-demo').croppie('bind', {
                url: e.target.result
            });
        }
        reader.readAsDataURL(input.files[0]);
    }	
} 
function removeRequest(index) {
    var store = localStorage.getItem("requests");
    store = JSON.parse(store);
    store.splice(index, 1);
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
/*
-------------------Search User Starts --------------------------------------
-------------------Rachna Saluja - 9/12/17 ---------------------------------
*/
function clearSearchBar(){
    $("#searchText").val('');
    //$("#search").html('');
}
function searchUser(contactListReady) {
    //console.log("in search function");
    /**
     * Add check - do not display current user(the one who is calling the search) in the contacts list
     */
    if(contactListReady){
        var i =0,numberOfUsers,currentContact;
        var result = new Set();
        var searchText = $("#searchText").val();

        var allContacts = JSON.parse(localStorage.getItem("allUsers"));

        //allContacts is an array of objects
        for(var key in allContacts){
            if(allContacts.hasOwnProperty(key)){
                var currentContact = allContacts[key];  //this is the user object
                var currentContactUserName = currentContact["fullName"];
                var currentContactEmailId = currentContact["emailId"];
                currentContactUserName = currentContactUserName.toLowerCase();
                currentContactEmailId = currentContactEmailId.toLowerCase();
                if(currentContactUserName.indexOf(searchText)!=-1 ||
                    currentContactEmailId.indexOf(searchText)!=-1)
                        result.add(currentContact);
            }
        }
        //console.log("Result is ");  
        //console.log(result);
        displaySearchUserResult(result);
    }
    else{
        console.log("searchUser: data not ready yet");
    }
}
function displaySearchUserResult(searchResult){
    console.log("in display result");
    //searchResult is a set we get from searchUser function
    var listElement = $("#searchUserResultList");
    if(searchResult!=null){
        var resultString="";
        searchResult.forEach(function(value,key,setObj){
            var userName = value["fullName"];
            var emailId = value["emailId"];
            resultString +="<div><li ><div class=\"inlineDisplay\"><img  class=\"imageSearchUser\" src = \"images/profile.png\" alt=\"\" /></div>"+ "<div class=\"inlineDisplay userDetailsSearchUser\" >";
            resultString +=userName+"<br>"+emailId+"</div><i onclick=\"addContact()\" class=\" addButton material-icons\">add</i></li></div><br>";
        })
     }
     listElement.html(resultString);
}
function areContactsLoaded(gotDataFromSource) {
    if(gotDataFromSource){
        searchUser(gotDataFromSource);
    }
    else{
        console.log("loadAllContacts: data not ready yet");
    }
}
