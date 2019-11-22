$(function(){
    chrome.storage.sync.get(['username'],function(user){
        $('#user').text(user.username);
    });

});