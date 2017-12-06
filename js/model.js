var currentUserId=0;
var currentMessageId=0;
ChatStatus={
  'SENT': 1,
  'RECEIVED': 2,
  'READ':3
}
UserContact=function(){
 this.userId=0;
 this.contactId=0;
 this.addContact=function(userId,contactId){
   this.userId=userId;
   this.contactId=contactId;
 }

}
User=function(){
  this.userId=0;
  this.fullName="";
  this.password="";
  this.phoneNo=0;
  this.emailId="";
  this.profilePictureUrl="";
  this.setUser=function(fullName,password,phoneNo,emailId,profilePictureUrl){
    this.userId=++currentUserId;
    this.fullName=fullName;
    this.password=password;
    this.phoneNo=phoneNo;
    this.emailId=emailId;
    this.profilePictureUrl=profilePictureUrl;
  }
}

IndividualChatMessage=function(){
 this.chatMessageId=0;
 this.chatMessageText="";
 this.createdOn=new Date();
 this.ChatStatus=0;
 this.starred=false;
 this.creator=new User();
 this.receiver=new User(); 
 this.setMessage=function(chatMessageText,createdOn,creator,receiver){
   this.chatMessageId=++currentMessageId;
   this.chatMessageText=chatMessageText;
   this.createdOn=createdOn;
   this.creator=creator;
   this.receiver=receiver;
 }
}
