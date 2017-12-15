function getCurrentUserEmail() {
    return getLocalStorage("thisUser").emailId;
}

function createUser(user){   
    // store this user's data in local storage
    setLocalStorage("thisUser", user);

    // storing user's data in user list(local storage)
    addUserTouserList(user);
}

function addUserTouserList(user){
    var store = getLocalStorage("allUsers");
    if (store == null) {
        store = new Map();
        store[user.emailId] = user;
        setLocalStorage("allUsers",store);
    } else {
        store[user.emailId] = user;
        setLocalStorage("allUsers",store);
    }
}

function storeChat(message) {
    var key = message.creator;
    var messages = null;
    messages = getLocalStorage("messages");
    if (message.messageType == 0)
        key = message.receiver;
    if (messages == null) {
        messages = new Map();
        var arr = [];
        arr.push(messageData);
        messages[key] = arr;
        setLocalStorage("messages",messages);
    } else {
        if (!messages[key]) {
            var arr = [];
            arr.push(message);
            messages[key] = arr;
        } else {
            var arr = messages[key];
            arr.push(message);
            messages[key] = arr;
        }
        setLocalStorage("messages",messages);
    }
}

function getChatMessages() {
    return getLocalStorage("messages");
}

function storeStarMsg(starredMessage) {
    
    var thisUser = getLocalStorage("thisUser");

    var store = null;

    store = getLocalStorage("starredMessages");
    if(store == null) {
        store = new Map();
        var arr = [];
        arr.push(starredMessage);
        store[starredMessage.creator] = arr;
        setLocalStorage("starredMessages",store)
    } else {
        if (store[starredMessage.creator] != undefined) {
            var starArray = [];
            starArray = store[starredMessage.creator];
            starArray.push(starredMessage);
            store[starredMessage.creator] = starArray;
            setLocalStorage("starredMessages",store);
        } else {
            var starArray = [];
            starArray.push(starredMessage);
            store[starredMessage.creator] = starArray;
            setLocalStorage("starredMessages", store);
        }
    }
}

function getStarredMessages() {
    var starmsgs = null;

    starmsgs = getLocalStorage("starredMessages");
    return starmsgs;
}

function getRequests() {
    var rqs = null;

    rqs = getLocalStorage("requests");
    return rqs;
}

function removeRequest(email) {
    var rqs = null;

    rqs = getLocalStorage("requests");
    delete rqs[email];
    setLocalStorage("requests",rqs);
}

function getChatContacts() {
    
    
    var users = null;

    users = getAllUsers();
    var currUser = users[getCurrentUserEmail()];
    return currUser.chatContacts;
}
function addChatContact(contactList) { 
    var users = null;
    
    users = getAllUsers();
    var currUser = users[getCurrentUserEmail()];
    currUser.chatContacts = contactList;
    users[getCurrentUserEmail] = currUser;
    setLocalStorage("allUsers",users);

}

function sendReminderChatValues() {
    var message = $('#remaindermessage').val();
    var reminderDate = $('#remainderdate').val();
    var reminderContact = $("#getcontact").val();
    var isValid = isValidMessage(message);
    if (isValid) {
        storeReminder(message, reminderDate, reminderContact, 0);
    }
}

function storeReminder(message, reminderDate, reminderContact, messageType) {
    var messageData = new ReminderMessage();
    var remindermessages = getLocalStorage("remindermessages");
    messageData.chatMessageText = message;
    messageData.scheduledDate = reminderDate;
    messageData.receiver = reminderContact;
    messageData.creator = email;
    messageData.chatStatus = "SENT";
    if (remindermessages == null) {
        remindermessages = [];
        remindermessages.push(messageData);
        setLocalStorage("remindermessages", remindermessages);
    } else {
        var remindermessagesArray = [];
        remindermessagesArray = getLocalStorage("remindermessages");
        remindermessagesArray.push(messageData);
        setLocalStorage("remindermessages", remindermessagesArray);
    }
}

function getReminderChat(str) {
    var messages = getLocalStorage("remindermessages");
    if (messages != null) {
        var remindermessagesArray = [];
        remindermessagesArray = getLocalStorage("remindermessages");
        var allMessages1 = "";
        var d = new Date();
        var dd = d.getDate();
        var mm = d.getMonth() + 1; //January is 0!
        var yyyy = d.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '-' + mm + '-' + yyyy;
        var datestring = dd + '-' + mm + '-' + yyyy;
        for (var i = 0; i < remindermessagesArray.length; i++) {
            if (datestring == remindermessagesArray[i].scheduledDate && remindermessagesArray[i].receiver == str && remindermessagesArray[i].chatStatus != "RECIEVED") {
                var messageData = new Message()
                    messageData.creator = remindermessagesArray[i].creator,
                    messageData.receiver = remindermessagesArray[i].receiver,
                    messageData.chatMessageId = 0,
                    messageData.createdOn = new Date(),
                    messageData.starred = false,
                    messageData.chatMessageText = remindermessagesArray[i].chatMessageText,
                    messageData.chatStatus = "RECIEVED",
                    messageData.chatType = "REMINDER"
                    messageData.ack = 0,
                    storeChat(messageData);
                    remindermessagesArray[i].chatStatus = "RECIEVED";
            }

            if (datestring == remindermessagesArray[i].scheduledDate && remindermessagesArray[i].receiver == email && remindermessagesArray[i].chatStatus != "RECIEVED") {
                var messageData = new Message()
                messageData.creator = remindermessagesArray[i].creator,
                messageData.receiver = remindermessagesArray[i].receiver,
                messageData.chatMessageId = 0,
                messageData.createdOn = new Date(),
                messageData.starred = false,
                messageData.chatMessageText = remindermessagesArray[i].chatMessageText,
                messageData.chatStatus = "RECIEVED",
                messageData.chatType = "REMINDER"
                messageData.ack = 0,
                storeChat(messageData);
                remindermessagesArray[i].chatStatus = "RECIEVED";

            }
        }
        setLocalStorage("remindermessages", remindermessagesArray);
    }
}
function remindersearchUser() {
    var i = 0,
        numberOfUsers, currentContact;
    var result = new Set();
    var allContacts = getLocalStorage("chatContacts");
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
    reminderDisplaySearchUserResult(result);

}