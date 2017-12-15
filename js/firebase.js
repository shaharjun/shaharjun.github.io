var user = {
    'fullName': '',
    'emailId': '',
    'userId': 0,
    'password': '',
    'phoneNo': 0,
    'profilePictureUrl': '',
    'chatContacts': []
};
// ab honga dangal
user = JSON.parse(localStorage.getItem("thisUser"));

var sessionId = JSON.parse(localStorage.getItem("sessionId"));
var allContacts = localStorage.getItem("chatContacts");
var myStatus = "available";

console.log(user);

//hard-coded
var contactArray = [];
if (user.userId == 2) {
    contactArray[3] = {
        'fullName': "rachna saluja",
        'emailId': "rachnasaluja@gmail.com",
        'userId': 3,
        'phoneNo': "9292929292",
        'profilePictureUrl': "",
        'contactUserStatus': 'offline'
    };
}
else if (user.userId == 3) {
    contactArray[2] = {
        'fullName': "kevin spacey",
        'emailId': "kevinspacey@gmail.com",
        'userId': 2,
        'phoneNo': "9292929292",
        'profilePictureUrl': "",
        'contactUserStatus': 'offline'
    };
}
if (allContacts != null) {
    var allContactsList = [];
    allContactsList = JSON.parse(allContacts);
    for (var i = 0; i < allContactsList.length; i++) {

        contactArray[allContactList[i].userId] = {
            'fullName': allContactsList[i].fullName,
            'emailId': allContactsList[i].emailId,
            'userId': allContactsList[i].userId,
            'phoneNo': allContactsList[i].phoneNo,
            'profilePictureUrl': allContactsList[i].profilePictureUrl,
            'contactUserStatus': 'offline'
        };
    }

}
function storeLoggedInUser(user) {

    var myStatus = "available";
    var contactStatus;
    firebase.database().ref().child('loggedInUser').child(user.userId).set({
        'emailId': user.emailId,
        'phoneNo': user.phoneNo,
        'profilePictureUrl': user.profilePictureUrl,
        'sessionId': sessionId,
        'fullName': user.fullName,
        'userStatus': myStatus,
        'chatContacts': contactArray
    });
    firebase.database().ref('loggedInUser/').once('value', function (snapshot) {

        for (var contact in contactArray) {
            if (snapshot.child(contact).exists()) {
                firebase.database().ref('loggedInUser/' + contactArray[contact].userId + '/chatContacts/' + user.userId)
                    .update({ 'contactUserStatus': myStatus });
                contactStatus = snapshot.child(contact).child('userStatus').val();
                firebase.database().ref('loggedInUser/' + user.userId + '/chatContacts/' + contactArray[contact].userId)
                    .update({ 'contactUserStatus': contactStatus });
            }
        }
    });
}

function updateStatus(myStatus, user) {
    firebase.database().ref('loggedInUser/' + user.userId).update({ 'userStatus': myStatus });
    firebase.database().ref('loggedInUser/').once('value', function (snapshot) {
        for (var contact in contactArray) {
            if (snapshot.child(contact).exists()) {
                firebase.database().ref('loggedInUser/' + contactArray[contact].userId + '/chatContacts/' + user.userId)
                    .update({ 'contactUserStatus': myStatus });
            }
        }
    });
}

var changedStatus;
firebase.database().ref('loggedInUser/' + user.userId + '/chatContacts').on('value', function (snapshot) {
    {
        snapshot.forEach(function (userSnapshot) {
            changedStatus = userSnapshot.child('contactUserStatus').val();
            console.log(changedStatus);
            if (changedStatus == "available") {
                $('.contact-status').css('border-color', 'green');
            }
            else if (changedStatus == "away") {
                $('.contact-status').css('border-color', 'yellow');
            }
            else if (changedStatus == "busy") {
                $('.contact-status').css('border-color', 'red');
            }
            else if (changedStatus == "offline") {
                $('.contact-status').css('border-color', '#32465a');
            }
        });
    }
});