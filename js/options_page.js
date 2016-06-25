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

      if (items.habitica_todo_user_id)
        $("#user_id").val(items.habitica_todo_user_id);

      if (items.habitica_todo_api_token)
        $("#api_token").val(items.habitica_todo_api_token);

      if (items.habitica_todo_difficulty)
        $("input:radio[name=difficulty]")
          .filter("[value="+items.habitica_todo_difficulty+"]")
          .trigger("click");

      if (items.habitica_todo_show_options)
        $("input:radio[name=show_options]")
          .filter("[value="+items.habitica_todo_show_options+"]")
          .trigger("click");

      if (items.habitica_todo_autoclose_tab)
        $("input:radio[name=autoclose_tab]")
          .filter("[value="+items.habitica_todo_autoclose_tab+"]")
          .trigger("click");

      if (items.habitica_todo_success_sound)
        $('#success_sound_select').val(items.habitica_todo_success_sound);

      // Set correct icon on load
      validate_and_update_icon('user_id', $('#user_id').val());
      validate_and_update_icon('api_token', $('#api_token').val());

      // Make jQueryUI buttons (they look nicer)
      $("#difficulty_radios")   .buttonset();
      $("#show_options_radios") .buttonset();
      $("#autoclose_tab_radios").buttonset();

      // On any input into a text field, then get the id and string
      // Use them to call a function that updates the icon.
      $('input[type=text]').on('input', function() {
        validate_and_update_icon($(this).attr('id'), $(this).val());
      })

      // When selecting a sound for success, play it
      $('#success_sound_select').on('change', function() {
        // Obviously there exists no 'none' audio file
        if ($(this).val() != 'none') {
          new Audio('sounds/'+$(this).val()+'.mp3').play();
        }
      })
    } else {
      // Handling errors, never seen one, but just incase
      $("#status").val(chrome.runtime.error);
    }
  });
});

// Preform a basic regex on a string, and update an icon if it passes
// Helps users identify a possibly incorrect user id and/or api token
function validate_and_update_icon(id, string) {
    // Valid format is 8-4-4-4-12
    if (/^[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}$/.test(string)) {
      // Regex pass, use a check mark
      $('#'+id+'_icon').removeClass('ui-icon-closethick').addClass('ui-icon-check');
    } else {
      // Regex fail, use an X
      $('#'+id+'_icon').removeClass('ui-icon-check').addClass('ui-icon-closethick');
    }
}

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
      //$("#status").finish().show().text("Saved your settings.").fadeOut(3000);
      console.log($("#save"));
      $("#save")
        .css("background","green")
        .text("Saved!")
        .delay(1000)
        .animate({
          "background-color": "#4b4377"
        }, 1000, function(){
          $("#save").text("Save settings");
        })
    };
  });
});
