$(function() {
  chrome.storage.sync.get([
    "habitica_todo_user_id",
    "habitica_todo_api_token",
    "habitica_todo_difficulty",
    "habitica_todo_show_options",
    "habitica_todo_autoclose_tab",
    "habitica_todo_success_sound"
  ], function(items) {
    if (!chrome.runtime.error) {
      $("#user_id")             .val(items.habitica_todo_user_id);
      $("#api_token")           .val(items.habitica_todo_api_token);
      $('#success_sound_select').val(items.habitica_todo_success_sound);

      $("#difficulty_radios").buttonset();
      $("input:radio[name=difficulty]").filter("[value="+items.habitica_todo_difficulty+"]").trigger("click");

      $("#show_options_radios").buttonset();
      $("input:radio[name=show_options]").filter("[value="+items.habitica_todo_show_options+"]").trigger("click");

      $("#autoclose_tab_radios").buttonset();
      $("input:radio[name=autoclose_tab]").filter("[value="+items.habitica_todo_autoclose_tab+"]").trigger("click");

      $('#success_sound_select').on('change', function() {
        if ($(this).val() != 'none') {
          new Audio('sounds/'+$(this).val()+'.mp3').play();
        }
      })
    } else {
      $("#status").val(chrome.runtime.error);
    }
  });
});

$("#save").on("click", function() {
  var user_id       = $("#user_id").val();
  var api_token     = $("#api_token").val();
  var difficulty    = $("input:radio[name=difficulty]:checked").val();
  var show_options  = $("input:radio[name=show_options]:checked").val();
  var autoclose_tab = $("input:radio[name=autoclose_tab]:checked").val();
  var success_sound = $("#success_sound_select").val();
  chrome.storage.sync.set({
    "habitica_todo_user_id":       user_id,
    "habitica_todo_api_token":     api_token,
    "habitica_todo_difficulty":    difficulty,
    "habitica_todo_show_options":  show_options,
    "habitica_todo_autoclose_tab": autoclose_tab,
    "habitica_todo_success_sound": success_sound
  }, function() {
    if (chrome.runtime.error) {
      $("#status").finish().show().text(chrome.runtime.error);
    } else {
      $("#status").finish().show().text("Successfully saved your user settings.").fadeOut(3000);
    };
  });
});
