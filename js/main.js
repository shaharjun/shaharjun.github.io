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

function sendChat(email) {
    var thisUser = null;

    thisUser = getLocalStorage("thisUser");

    var sentMessage = new IndividualChatMessage();
    sentMessage.chatMessageText = $('#chatBox').val();
    sentMessage.creator = thisUser.emailId;
    sentMessage.receiver = email;
    
    var receivedMessage = new IndividualChatMessage();
    receivedMessage.chatMessageText = 'hmm';
    receivedMessage.receiver = thisUser.emailId;
    receivedMessage.creator = email;
    
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
        storeChat(sentMessage);
        storeChat(receivedMessage);
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
    //console.log("in search contact");
    var searchContactText = $("#searchContactText").val();
    var searchResult = null;
    var allContactsList = null;
    allContactsList = getChatContacts();//localStorage.getItem("chatContacts");
   
   //
   
    //allContactsList = JSON.parse(allContacts);
    var allContactsOfUser = allContactsList;
    if (searchContactText == "") {
        searchResult = null;
        displayAllContacts(allContactsOfUser);
    } else {
        searchResult = new Set();
        searchContactText = searchContactText.toLowerCase();
        //console.log(searchContactText);
        for (var key in allContactsList) {
            if (allContactsList.hasOwnProperty(key)) {
                var currentContact = allContactsList[key]; //this is the user object
                var currentContactUserName = currentContact["fullName"];
                var currentContactEmailId = currentContact["emailId"];
                currentContactUserName = currentContactUserName.toLowerCase();
                currentContactEmailId = currentContactEmailId.toLowerCase();
                if (currentContactUserName.indexOf(searchContactText) != -1 ||
                    currentContactEmailId.indexOf(searchContactText) != -1)
                    searchResult.add(currentContact);
            }
        }
        searchContactDisplayResult(searchResult, allContactsOfUser);
    }
}

function searchContactDisplayResult(searchResult, allContactsOfUser) {
    //console.log("in display");
    //console.log(searchResult);
    var allContactsString = "";
    if (searchResult != null) {
        //console.log("in not null");
        searchResult.forEach(function (value, key, setObj) {
            //console.log("in loop");
            var contactName = value["fullName"];
            var email = value["emailId"];
            //console.log(contactName);
            allContactsString += '<li class="contact" data-email="' + email + '"><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />' +
                '<div class="meta"><p class="name">' + contactName + '</p></div></div></li>';
        })
        $('#contacts > ul').html(allContactsString);
    } else displayAllContacts(allContactsOfUsers);

}
/**
 * -------------------End of code ------------------------------------
 */


function currentContact(str) {
    var users = JSON.parse(localStorage.getItem("allUsers"));
    var user = users[str];
    $('#chat p').html(user.fullName);
    $('#cprof #userNameValue').html(user.fullName);
    $('#cprof #userEmailValue').html(user.emailId);
    $('#cprof #userPhoneValue').html(user.phoneNo);
    bringToTop($("#chat"));
    $("#background").css('z-index', -10);
    window.setTimeout(function () {
        scrollToBottom("messages");
    }, 1);
    $('.contact-profile').click(function () {
        bringToTop($("#cprof"));
    });
}

$(document).ready(function () {
    var currentContactIndex = 0;
    var user = null;
   
    user = getLocalStorage("thisUser");
    userName = user.fullName;
    email = user.emailId;
    phoneNo = user.phoneNo;
    profilePicture = user.profilePictureUrl;

    //set uprof and eprof values
    $("#uprof #userNameValue").html(userName);
    $("#uprof #userEmailValue").html(email);
    $("#uprof #userPhoneValue").html(phoneNo);
    $('#uprof .display-pic').attr('src', profilePicture);
    $("#eprof #userNameValue").attr('value', userName);
    $("#eprof #userEmailValue").attr('value', email);
    $("#eprof #phone").attr('value', phoneNo);

    $('#profile-img').attr('src', profilePicture);

    $("#profile > div > p").html(userName);
    $('#expanded > ul > li:nth-child(1)').html("Name : " + userName);
    $('#expanded > ul > li:nth-child(2)').html("Email : " + email);
    $('#expanded > ul > li:nth-child(3)').html("Phone : " + phoneNo);
    var allContacts = []
    allContacts = getAllContacts();
    displayAllContacts(allContacts);

    $('#sb').click(function () {
        var str = $("#cprof #userEmailValue").text();
        sendChat(str);
    });
    if ("sessionId" in localStorage) {
        console.log("Access Allowed");
    } else {
        console.log("Access Denied, redirecting to Login");
        window.location.href = "login.html";
    }
    $('body').on('click', '.contact', function () {
        console.log($(this));
        var str = $(this).data("email");
        currentContactIndex = $(this).index();
        currentContact(str);
        getReminderChat(str)
        displayChatMessages(str);
    });
    $(".expand-button").click(function () {
        $("#profile").toggleClass("expanded");
        $("#contacts").toggleClass("expanded");
    });
    $('#logout-button').click(function () {
        localStorage.removeItem("sessionId");
        window.location.href = "login.html";
    });
    $("#profile-img").click(function () {
        $("#status-options").addClass("active");
    });
    $("#status-options ul li").click(function () {
        $("#profile-img").removeClass();
        $("#status-online").removeClass("active");
        $("#status-away").removeClass("active");
        $("#status-busy").removeClass("active");
        $("#status-offline").removeClass("active");
        $(this).addClass("active");
        var myStatus = null;        
        if ($("#status-online").hasClass("active")) {
            $("#profile-img").addClass("online");
            myStatus = "available";
        } else if ($("#status-away").hasClass("active")) {
            $("#profile-img").addClass("away");
            myStatus = "away";
        } else if ($("#status-busy").hasClass("active")) {
            $("#profile-img").addClass("busy");
            myStatus = "busy";
        } else if ($("#status-offline").hasClass("active")) {
            $("#profile-img").addClass("offline");
            myStatus = "offline";
        } else {
            $("#profile-img").removeClass();
        };
        updateStatus(myStatus, user);
        $("#status-options").removeClass("active");
    });
    $('.modal').modal();

    $("#myProfileOuterDiv").click(function () {
        bringToTop($("#uprof"));
    });
    $('#upload-demo').croppie({
        enableExif: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'circle'
        },
        zoom: 0,
        showZoomer: false,
        boundary: {
            width: 300,
            height: 300
        }
    });
    $('#upload-demo').croppie('bind', {
        url: user.profilePictureUrl,
        zoom: 0
    });
    $("#updateProfileBtn").click(function () {
        $('#upload-demo').croppie('result', 'base64').then(function (base64) {
            var user = JSON.parse(localStorage.getItem('thisUser'));
            var eUserName = $("#eprof #userNameValue").val();
            var eUserEmail = $("#eprof #userEmailValue").val();
            var eUserPhone = $("#eprof #phone").val();
            user.profilePictureUrl = base64;
            user.fullName = eUserName;
            user.emailId = eUserEmail;
            user.phoneNo = eUserPhone;
            localStorage.setItem("thisUser", JSON.stringify(user));
            Materialize.toast("Profile Updated. Refreshing Page.", 4000);
            location.reload();
        });
    });
    $(document).bind("mouseup touchend", function (e) {
        if (e.target.id != "profile-img") {
            $("#status-options").removeClass("active");
        }
    });
    //$("#searchUserButton").prop("disabled", true);
    $("#addcontact").click(function(){
        clearSearchBar();
        searchUser(true);
    })
    $("#closeAddContactButton").click(function () {
        clearSearchBar();
    });
    $("#clearSearchContactBar").click(function () {
        $("#searchContactText").val('');
        var allContacts = getChatContacts(); //localStorage.getItem("chatContacts");
        var allContactsOfUser = allContacts;//JSON.parse(allContacts);
        //$('#contacts > ul').html(''); 
        displayAllContacts(allContactsOfUser);
    });
    var contacts = new Map();
    areContactsLoaded(true);
    $("#searchUserButton").click(function(){
        searchUser(true);
    })
    // $.getJSON('./contacts.json', function (data) {}).done(function (data) {
    //         $.each(data, function (i, contact) {
    //             // $('ul').append('<li>' + contact.name +'</li>');
    //             contacts[contact["emailId"]] = contact;
    //             //console.log(contacts);
    //         });
    //         localStorage.setItem("allUsers", JSON.stringify(contacts));
    //         areContactsLoaded(true);
    //         $("#searchUserButton").prop("disabled", false);
    //         $("#searchUserButton").click(function () {
    //             searchUser(true);
    //         });
    //     })
    //     .error(function () {
    //         console.log("Data could not be loaded");
    //         areContactsLoaded(true);
    //         $("#searchUserButton").prop("disabled", false);
    //         $("#searchUserButton").click(function () {
    //             searchUser(true);
    //         })
    //     });
    $('#chatBox').keypress(function (event) {
        if (event.keyCode == 13) {
            var str = $("#cprof #userEmailValue").text();
            sendChat(str);
        }
    });
    $('#updateProfileInfoBtn').click(function () {
        var eUserName = $("#eprof #userNameValue").val();
        var eUserEmail = $("#eprof #userEmailValue").val();
        var eUserPhone = $("#eprof #phone").val();
        user.fullName = eUserName;
        user.emailId = eUserEmail;
        user.phoneNo = eUserPhone;
        localStorage.setItem("thisUser", JSON.stringify(user));
        Materialize.toast("Profile Info changed. Please Refresh to see changes.", 4000);
    });

    $('#contacts > ul > li.request').click(function () {
        var rq = null;
        
        rq =getRequests();
        var emailId = $(event.currentTarget).data("emailid");
        var msg = '<li class="sent"><img src="images/profile.png" alt="">' +
            '<p>' + rq[emailId].creator + ' wants to connect with you</p>' +
            '&nbsp<i onClick="approveRequest(\'' + emailId + '\')" style="font-size:2em;color:seagreen" class="fa fa-check-circle" aria-hidden="true"></i>' +
            '&nbsp&nbsp<i onClick="declineRequest(\'' + emailId + '\')" style="font-size:2em;color:indianred" class="fa fa-times" aria-hidden="true"></i></li>';
        $('#messages ul').html(msg);
        $('.message-input').css('visibility', 'hidden');
        bringToTop($('#chat'));
    });
    $("#remindercreate").hide();
    $("#createlist").click(function () {
        remindersearchUser()
        $("#remindercreate").toggle();

    });

});

// scroll to bottom
function scrollToBottom(id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function displayChatMessages(email) {
    var allMessages = " ";
    $('.message-input').css('visibility', 'visible');
    var userMail = getCurrentUserEmail();
    var messages = getChatMessages();
    var star = "<i onClick='makeGold()' style='color: burlywood' class='fa fa-star starmsg' aria-hidden='true'></i>"
    if (messages[userMail][email] != null) {
        var thisUser = getLocalStorage("thisUser");
        var messagesArray = [];
        messagesArray = messages[userMail][email];
        if (messagesArray != undefined) {
            for (var i = 0; i < messagesArray.length; i++) {
                if (messagesArray[i].creator == thisUser.emailId) {
                    allMessages += "<li class='replies'>" +
                        "<img src='images/profile.png' alt='' />" +
                        "<p style=\"word-wrap: break-word;\">" + messagesArray[i].chatMessageText + "</p></li>";
                } else if (messagesArray[i].receiver == thisUser.emailId) {
                    allMessages += "<li class='sent'>" +
                        "<img src='images/profile.png' alt='' />" +
                        "<p onclick='showStar()' style=\"word-wrap: break-word;\">" + messagesArray[i].chatMessageText + "</p>" + star + "</li>";
                }
            }
        }
    }
    $('#messages ul').html(allMessages);
}
function makeGold() {
    var thisUser = getLocalStorage("thisUser");
    var msg = new IndividualChatMessage();
    $(event.currentTarget).css('color', 'gold');
    var email = $('#cprof #userEmailValue').text();
    var text = $(event.currentTarget).parent().children('p').text();
    msg.chatMessageText = text;
    msg.creator = email;
    msg.receiver = thisUser.emailId;
    storeStarMsg(msg);
}

function showStar() {
    var str = $(event.currentTarget).text();
    var star = $(event.currentTarget).parent().children('i');
    $(star).css('visibility', 'visible');
}

function displayAllContacts(allContacts) {
    var allContactsString = "";
    getRequests().then(function(store) {
    if (store) {
        for (i=0;i<store.length;i++) {
            allContactsString += '<li data-emailid="' + store[i].emailId + '" class="request" ><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />' +
                '<div class="meta"><p class="name">' + store[i].creator + '</p></div></div></li>';
        }
    }
    if (allContacts != null) {
        for (var key in allContacts) {
            allContactsString += '<li class="contact" data-email="' + key + '"><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />' +
                '<div class="meta"><p class="name">' + allContacts[key].fullName + '</p></div></div></li>';
        }
    }
    $('#contacts > ul').html(allContactsString);
});
}


function showStarred() {
    bringToTop($('#stardisplay'));
    displayStarred();
}

function displayStarred() {
    var messages = null;
    
    messages = getStarredMessages();
    if (messages != null) {
        var messagesArray = [];
        var allMessages = "";
        for (var key in messages) {
            var arr = messages[key];
            for (i = 0; i < arr.length; i++) {
                var from = arr[i].creator;
                var msg = arr[i].chatMessageText;
                allMessages += "<li class='sent'><img src='images/profile.png' alt='' />" +
                    "<p style='word-wrap: break-word;'>" +
                    msg +
                    "<br><br><span style='float:right; color: darkgray; font-size: 1em'>" +
                    from +
                    "</span></p></li>";
            }
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
                url: e.target.result,
                zoom: 0
            });
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function declineRequest(email) {
    removeRequest(email);
    var el = $('#contacts > ul > li').eq($(event.currentTarget));
    el.remove();
    bringToTop($('#background'));
    location.reload();
}

function approveRequest(email) {
    var store = getRequests();
    var name = store[email].creator;
    removeRequest(email);
    var contact =new User();
    var users = getAllUsers();
    contact = users[email];

    var contacts = getChatContacts();

    if (contacts != null && contacts.length!=0) {
        contacts[email] = contact;
        addChatContact(contacts);
    } else {
        var contactMap = new Map();
        contactMap[email] = contact;
        addChatContact(contactMap);
    }
    var el = $('#contacts > ul > li').eq($(event.currentTarget));
    el.remove();
    var html = '<li class="contact" data-email="' + email + '"><div class="wrap"><span class="contact-status"></span> <img src="images/profile.png" alt="" />' +
        '<div class="meta"><p class="name">' + contact.fullName + '</p></div></div></li>';
    $('#contacts > ul').append(html);
    bringToTop($('#background'));
    var $toastContent = $('<span>' + name + ' has been added ' + '</span>').add($('<button  onClick="location.reload()" class="btn-flat toast-action">Ok</button>'));
    Materialize.toast($toastContent, 10000);
}
/*
-------------------Search User Starts --------------------------------------
-------------------Rachna Saluja - 9/12/17 ---------------------------------
*/
function clearSearchBar() {
    $("#searchText").val('');
    //$("#search").html('');
}

function searchUser(contactListReady) {
    //console.log("in search function");
    /**
     * Add check - do not display current user(the one who is calling the search) in the contacts list
     */
    if (contactListReady) {
        var i = 0,
            numberOfUsers, currentContact;
        var result = new Set();
        var searchText = $("#searchText").val();
        searchText = searchText.toLowerCase();
        var allContacts;
        getAllUsers().then(function(data){
            allContacts = data;
            var sizeOfData = data.length;
            for(var i =0;i<sizeOfData;i++){
                var currentContact = data[i];
                var currentContactUserName = currentContact.fullName;
                var currentContactEmailId = currentContact.emailId;
                currentContactUserName = currentContactUserName.toLowerCase();
                currentContactEmailId = currentContactEmailId.toLowerCase();
                if (currentContactUserName.indexOf(searchText) != -1 ||
                currentContactEmailId.indexOf(searchText) != -1)
                    result.add(currentContact);
            }
            displaySearchUserResult(result);
        });
    } else {
        console.log("searchUser: data not ready yet");
    }
}

function displaySearchUserResult(searchResult) {
    //searchResult is a set we get from searchUser function
    var listElement = $("#searchUserResultList");
    var resultString = "";
    if (searchResult != null) {
        var resultString = "";
        searchResult.forEach(function (value, key, setObj) {
            var userName = value["fullName"];
            var emailId = value["emailId"];
            resultString += "<div><li ><div class=\"inlineDisplay\"><img  class=\"imageSearchUser\" src = \"images/profile.png\" alt=\"\" /></div>" + "<div class=\"inlineDisplay userDetailsSearchUser\" >";
            resultString += userName + "<br>" + emailId + "</div><i data-mail=" + emailId + " onclick=\"addContact()\" class=\" addButton material-icons\">add</i></li></div><br>";
        })
    }
    listElement.html(resultString);
}

function areContactsLoaded(gotDataFromSource) {
    if (gotDataFromSource) {
        searchUser(gotDataFromSource);
    } else {
        console.log("loadAllContacts: data not ready yet");
    }
}

function addContact() {

    var emailId = $(event.currentTarget).data("mail");
    var request = new IndividualChatMessage();
    getAllUsers().then(function(data) {
    console.log(data);
    var users = data;
    var contact = getUser(users,emailId);
    console.log(contact);
    request.creator = getLocalStorage("thisUser").emailId;
    var currUser = getLocalStorage("thisUser");
    request.receiver = contact.emailId;
    //ack being used as userId of receiver buffer
    request.ack = contact.userId;
    // var store = getRequests();
    // if (store == null || store.length == 0) {
    //     var map = new Map();
    //     map[emailId] = request;
    //     setLocalStorage("requests",map);
    // } else {
    //     store[emailId] = request;
    //     setLocalStorage('requests', store);
    // }
    storeRequest(request).then(function(data) {
    var $toastContent = $('<span>' + 'Request Sent ' + '</span>').add($('<button onClick="location.reload()" class="btn-flat toast-action">Ok</button>'));
    Materialize.toast($toastContent, 10000);
    });
});
}

function sendReminderChatValues() {
    var message = $('#remaindermessage').val();
    var reminderDate = $('#remainderdate').val();
    var reminderContact = $("#getcontact").val();
    var isValid = isValidMessage(message);
    if (isValid) {
        storeReminder(message, reminderDate, reminderContact);
    }
}

function reminderDisplaySearchUserResult(searchResult) {
    //searchResult is a set we get from searchUser function
    var listElement = $("#rsearchUserResultList");
    if (searchResult != null) {
        var resultString = "";
        searchResult.forEach(function (value, key, setObj) {
            var userName = value["fullName"];
            var emailId = value["emailId"];
            resultString += "<div><li ><div class=\"inlineDisplay\"><img  class=\"imageSearchUser\" src = \"images/profile.png\" alt=\"\" /></div>" + "<div class=\"inlineDisplay userDetailsSearchUser\" >";
            resultString += userName + "<br>" + emailId + "</div><i data-mail=" + emailId + " onclick=\"reminderContactToDisplay()\" class=\" addButton material-icons\">add</i></li></div><br>";
        })
    }
    listElement.html(resultString);
}


function reminderContactToDisplay() {
    var emailId = $(event.currentTarget).data("mail");
    var users = getChatContacts();
    var contact = users[emailId];
    name = contact.fullName;
    var dis = name + "(" + emailId + ")";
    $("#remindercontact").val(dis);
    $("#getcontact").val(emailId);
    $("#remindercreate").hide();
}

function remindersearchUser() {
    var i = 0,
        numberOfUsers, currentContact;
    var result = new Set();
    var allContacts = getChatContacts();    //getting all contacts of current user
    numberOfUsers = allContacts.size;
   for (var key in allContacts){
       var currentContact = allContacts[key];   //one contact = current contact
       var currentContactEmailId = currentContact.emailId;
       var currentContactUserName = currentContact.fullName;
            result.add(currentContact);
        }
   
    reminderDisplaySearchUserResult(result);

}

