document.body.onload = function() {
  chrome.storage.sync.get("habitica_todo_user_id", function(items) {
    if (!chrome.runtime.error) {
      document.getElementById("user_id").value = items.habitica_todo_user_id;
    }
  });
  chrome.storage.sync.get("habitica_todo_api_token", function(items) {
    if (!chrome.runtime.error) {
      document.getElementById("api_token").value = items.habitica_todo_api_token;
    }
  });
  chrome.storage.sync.get("habitica_todo_difficulty", function(items) {
    if (!chrome.runtime.error) {
      document.getElementById("difficulty").value = items.habitica_todo_difficulty;
    }
  });
}

document.getElementById("save").onclick = function() {
  var user_id    = document.getElementById("user_id").value;
  var api_token  = document.getElementById("api_token").value;
  var difficulty = document.getElementById("difficulty").value;
  chrome.storage.sync.set({
    "habitica_todo_user_id": user_id,
    "habitica_todo_api_token": api_token,
    "habitica_todo_difficulty": difficulty,
  }, function() {
    if (chrome.runtime.error) {
      document.getElementById("status").innerText = chrome.runtime.error;
    } else {
      document.getElementById("status").innerText = "Successfully saved your user settings.";
    }
  });
}
