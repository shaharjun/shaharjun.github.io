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