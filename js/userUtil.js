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