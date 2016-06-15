$(function() {
  chrome.storage.sync.get([
    "habitica_todo_user_id",
    "habitica_todo_api_token",
    "habitica_todo_difficulty",
    "habitica_todo_show_options",
    "habitica_todo_autoclose_tab"
  ], function(items) {

    if (!chrome.runtime.error) {
      if (
        !items.habitica_todo_user_id      ||
        !items.habitica_todo_api_token    ||
        !items.habitica_todo_difficulty   ||
        !items.habitica_todo_show_options ||
        !items.habitica_todo_autoclose_tab) {
        chrome.tabs.create({'url': '/options_page.html'});
      } else {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function(tab) {
          items.tab_title = tab[0].title;
          items.tab_url   = tab[0].url;
          items.tab_id    = tab[0].id;
          items.due_date  = '';
          if (items.habitica_todo_show_options == 'no') {
            $("body").load("loader.html", function() {
              post_data(items);
            });
          } else {
            prepare_form(items);
          }
        });
      }
    }
  });
});

function prepare_form(items) {
  $("body").load("popup_form.html", function() {
    $("#title").val(items.tab_title);
    $("#url").val(items.tab_url);
    $("#difficulty_radios").buttonset();
    $("input:radio[name=difficulty]").filter("[value="+items.habitica_todo_difficulty+"]")
                                     .trigger("click");
    $("#date").datepicker({
      dateFormat: "yy/mm/dd"
    });

    $("#send_button").on("click", function() {
      $('#loading_wrapper').show();
      $('#loading_inner').load('loader.html');
      items.tab_title = $('#title').val();
      items.tab_url   = $('#url').val();
      items.due_date  = $('#date').val();
      items.habitica_todo_difficulty = $('input:radio[name=difficulty]:checked').val();
      post_data(items);
    })
  });
}

function post_data(items){


  // Remove ] and ) where it would break Habitica markdown
  var url   = items.tab_url.split(')').join('%29');
  var title = items.tab_title.split(']').join('\]')
                             .split('[').join('\[');

  // Change relative URLs to absolute.
  if (/^[a-zA-Z0-9_\-]+:\/\//.test(url) == false) {
    url = 'http://' + url;
  }

  xhr = new XMLHttpRequest();
  xhr.open("POST", "https://habitica.com/api/v3/tasks/user", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("x-api-user", items.habitica_todo_user_id);
  xhr.setRequestHeader("x-api-key", items.habitica_todo_api_token);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 201) {
        new Audio('sounds/success_1.mp3').play();
        setTimeout(function(){
          if (items.habitica_todo_autoclose_tab == 'yes') {
            chrome.tabs.remove(items.tab_id);
          } else {
            window.close();
          }
        }, 1000);
      } else {
        alert("Failed to send. Status code: "+xhr.status+". Status text: '"+xhr.statusText+"'");
        window.close();
      }
    }
  }
  var difficulty = 1;
  switch(items.habitica_todo_difficulty) {
    case 'trivial': difficulty = 0.1; break;
    case 'easy':    difficulty = 1;   break;
    case 'medium':  difficulty = 1.5; break;
    case 'hard':    difficulty = 2;   break;
    default:        difficulty = 1;   break;
  }
  xhr.send(JSON.stringify({
    "text": "["+title+"]("+url+" )",
    "type":"todo",
    "value":"0",
    "priority": difficulty,
    "date": items.due_date
  }));
}
