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
//console.log(user);
var contactArray = [];
//hard-coded
if (user.userId == 2) {
    contactArray[1] = {
        'fullName': "rachna saluja",
        'emailId': "rachnasaluja@gmail.com",
        'userId': 1,
        'phoneNo': "9292929292",
        'profilePictureUrl': "",
        'contactUserStatus': ""
    };
}
else if (user.userId == 1) {
    contactArray[2] = {
        'fullName': "riya tilwani",
        'emailId': "riyatilwani@gmail.com",
        'userId': 2,
        'phoneNo': "9292929292",
        'profilePictureUrl': "",
        'contactUserStatus': ""
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
            'contactUserStatus': ""
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
firebase.database().ref('loggedInUser/' + user.userId + '/chatContacts').on('value', function (snapshot) {
    {
        snapshot.forEach(function (userSnapshot) {
            console.log(userSnapshot.val());
            var changedStatus = userSnapshot.child('contactUserStatus').val();
            console.log("User " + userSnapshot.child("fullName").val() + " is " + changedStatus);
            var flag =0;
            $('li.contact').each(function (contact) {                
                if ($(this).data("email") == userSnapshot.child('emailId').val() && flag==0) {
                    if (changedStatus == "available") {
                        $('div span',this).css('background-color', 'green');
                    }
                    else if (changedStatus == "away") {
                        $('div span',this).css('background-color', 'yellow');
                    }
                    else if (changedStatus == "busy") {
                        $('div span',this).css('background-color', 'red');
                    }
                    else if (changedStatus == "offline") {
                        $('div span',this).css('background-color', '#95a5a6');
                    }
                    flag=1;
                }
            });
        });
    }
});