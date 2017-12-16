function getCurrentUserEmail() {
    var user =null;
    user = getLocalStorage("thisUser");
    return user.emailId;
}

function createUser(user){   
    // store this user's data in local storage
    setLocalStorage("thisUser", user);

    // storing user's data in user list(local storage)
    addUserToUserList(user);
}

function addUserToUserList(user){
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
    
    var thisUser = getLocalStorage("thisUser");
    var key = null;
    if(thisUser.emailId == message.creator)
        key = message.receiver;
    else
        key = message.creator;
    var messages = null;
    
    messages = getLocalStorage("messages");
    if (messages == null) {
        messages = new Map();
        var arr = new Map();
        var arr1 = [];
        arr1.push(message);
        arr[key] = arr1;
        messages[thisUser.emailId] = arr;
        setLocalStorage("messages",messages);
    } else {
        if (!messages[thisUser.emailId][key]) {
            var arr = [];
            arr.push(message);
            messages[thisUser.emailId][key] = arr;
        } else {
            var arr = messages[thisUser.emailId][key];
            arr.push(message);
            messages[thisUser.emailId][key] = arr;
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
    console.log(getCurrentUserEmail());
    var currUser = users[getCurrentUserEmail()];
    return currUser.chatContacts;
}
function addChatContact(contactList) { 
    var users = null;
    
    users = getAllUsers();
    var currUser = users[getCurrentUserEmail()];
    currUser.chatContacts = new Map();
    currUser.chatContacts = contactList;
    console.log(currUser.chatContacts);
    console.log(currUser);
    users[getCurrentUserEmail()] = currUser;
    console.log(users[getCurrentUserEmail()]);
    console.log(users);
    setLocalStorage("thisUser",currUser);
    setLocalStorage("allUsers",users);
}
function getAllUsers() {
    var users = null;

    return getLocalStorage("allUsers");
}
function getAllContacts() {
    var thisUser = getLocalStorage("thisUser");
    var allContacts = thisUser.chatContacts;
    if (allContacts != null) {
        return allContacts;
    }
    return null;
}

function storeReminder(message, reminderDate, reminderContact) {
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
               //console.log(remindermessagesArray[i])
                var messageData = new IndividualChatMessage()
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
                var messageData = new IndividualChatMessage()
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
