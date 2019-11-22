$(function(){
    chrome.storage.sync.get(['Email'],function(user){
        $('#user').text(user.Username);
    });

});