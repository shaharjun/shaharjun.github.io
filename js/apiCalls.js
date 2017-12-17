function getCurrentUserEmail() {
    var user =null;
    user = getLocalStorage("thisUser");
    return user.emailId;
}

function createUser(user){   
    // store this user's data in local storage
    if(user!=null) {
    //user = JSON.parse(user);
    console.log("inside createUser");
    firebase.database().ref('allUsers/' + user.userId).set(user);
    //addUserToUserList(user);
    }
    // storing user's data in user list(local storage)
    
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
    
    return firebase.database().ref('contactRequests/').once('value').then(function(snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    });
   
}

function removeRequest(email) {
    var rqs = null
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
// function getAllUsers() {
//     var users = null;

//     return firebase.database().ref('allUsers/').child('');
// }
function getAllContacts() {
    var thisUser = getLocalStorage("thisUser");
    var allContacts = thisUser.chatContacts;
    if (allContacts != null) {
        return allContacts;
    }
    return null;
}
function getAllUsers() {
    //var def = $.Deferred();
    return firebase.database().ref('allUsers/').once('value').then(function(snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    });
    //return def.promise();
}
function getLoggedInUsers() {
    return firebase.database().ref('loggedInUser/').once('value').then(function(snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    });
}
function getUser(users,emailId) {
    for(i=0;i<users.length;i++) {
        if((users[i].emailId).indexOf(emailId) != -1) {
            console.log(users[i]);
            return users[i];
        }
    }
    return null;
}
function storeRequest(request) {
    var senderStatus = "offline";
    var senderObject;
    var receiverObject;
    var receiverStatus = 'offline';
    getLoggedInUsers().then(function(data) {
        console.log("in store request");
        console.log(data);
        receiverObject = getUser(data,request.receiver)
        if(receiverObject!=null) {
            receiverStatus = receiverObject.userStatus;
        }
        var picUrl = getLocalStorage("thisUser").profilePictureUrl;
        var creatorId = getLocalStorage("thisUser").userId;
        var name = getLocalStorage("thisUser").fullName;
        firebase.database().ref().child('contactRequests').child(request.ack).child(creatorId).set({
            'sender' : request.creator,
            'senderName' : name,
            'requestStatus' : 'pending',
            'availabilityOfReceiver' : receiverStatus,
            'profilePictureUrlOfSender' : profilePictureUrl,
            'createdOn' : request.createdOn.toString()
        })
        return true;
    })
    return false;
}