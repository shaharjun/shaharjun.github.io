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
    
    var key = message.creator;
    var messages = null;
    
    messages = getLocalStorage("messages");
    if (messages == null) {
        messages = new Map();
        var arr = [];
        arr.push(message);
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