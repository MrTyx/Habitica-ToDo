chrome.browserAction.onClicked.addListener(function (tab) {

    var url = tab.url.split('(').join('%28')
                     .split(')').join('%29')
                     .split('[').join('%5B')
                     .split(']').join('%5D');

    var title = tab.title.split('(').join('%28')
                         .split(')').join('%29')
                         .split('[').join('%5B')
                         .split(']').join('%5D');
    


    chrome.storage.sync.get({
      habitica_todo_user_id: '',
      habitica_todo_api_token: '',
      habitica_todo_difficulty: 1
    }, function(items) {
      xhr = new XMLHttpRequest();
      xhr.open("POST", "https://habitica.com:443/api/v2/user/tasks", true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("x-api-user", items.habitica_todo_user_id);
      xhr.setRequestHeader("x-api-key", items.habitica_todo_api_token);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          new Audio('sounds/success_1.mp3').play();
        } else {
          console.log("Error", xhr.statusText);
        }
      }
      xhr.send(JSON.stringify({
        "text": "["+title+"]("+url+")",
        "type":"todo",
        "value":"0",
        "priority": parseFloat(items.habitica_todo_difficulty)
      }));
    });
});
