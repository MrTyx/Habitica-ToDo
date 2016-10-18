$(function() {
  chrome.storage.sync.get([
    "habitica_todo_user_id",
    "habitica_todo_api_token",
    "habitica_todo_add_days",
    "habitica_todo_difficulty",
    "habitica_todo_prefix",
    "habitica_todo_suffix",
    "habitica_todo_show_options",
    "habitica_todo_autoclose_tab",
    "habitica_todo_success_sound"
  ], function(items) {
    if (!chrome.runtime.error) {

      if (!items.habitica_todo_difficulty)    { items.habitica_todo_difficulty = "easy";    }
      if (!items.habitica_todo_show_options)  { items.habitica_todo_show_options = "yes";   }
      if (!items.habitica_todo_autoclose_tab) { items.habitica_todo_autoclose_tab = "no";   }
      if (!items.habitica_todo_success_sound) { items.habitica_todo_success_sound = "none"; }

      $("#user_id").val(items.habitica_todo_user_id);
      $("#api_token").val(items.habitica_todo_api_token);
      $("#add_days").val(items.habitica_todo_add_days);
      $("#prefix").val(items.habitica_todo_prefix);
      $("#suffix").val(items.habitica_todo_suffix);
      $('#success_sound_select').val(items.habitica_todo_success_sound);

      $("input:radio[name=difficulty]").filter("[value="+items.habitica_todo_difficulty+"]").trigger("click");
      $("input:radio[name=show_options]").filter("[value="+items.habitica_todo_show_options+"]").trigger("click");
      $("input:radio[name=autoclose_tab]").filter("[value="+items.habitica_todo_autoclose_tab+"]").trigger("click");

      // Set correct icon on load
      validate_and_update_icon('user_id',   $('#user_id').val());
      validate_and_update_icon('api_token', $('#api_token').val());

      // On any input into a text field, then get the id and string
      // Use them to call a function that updates the icon.
      $('input[type=text]').on('input', function() {
        validate_and_update_icon($(this).attr('id'), $(this).val());
      });

      // Enable all the tooltips on the page
      // http://getbootstrap.com/javascript/#tooltips-examples
      $('[data-toggle="tooltip"]').tooltip();

      // When selecting a sound for success, play it
      $('#success_sound_select').on('change', function() {
        // Obviously there exists no 'none' audio file
        if ($(this).val() != 'none') {
          new Audio('sounds/'+$(this).val()+'.mp3').play();
        }
      });
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
      $('#'+id+'_icon').removeClass('glyphicon-remove').addClass('glyphicon-ok');
      $('#'+id+'_form').removeClass('has-error').addClass('has-success');
    } else {
      // Regex fail, use an X
      $('#'+id+'_icon').removeClass('glyphicon-ok').addClass('glyphicon-remove');
      $('#'+id+'_form').removeClass('has-success').addClass('has-error');
    }
}

$("#save").on("click", function() {
  var user_id       = $("#user_id").val();
  var api_token     = $("#api_token").val();
  var add_days      = $("#add_days").val();
  var difficulty    = $("input:radio[name=difficulty]:checked").val();
  var prefix        = $("#prefix").val();
  var suffix        = $("#suffix").val();
  var show_options  = $("input:radio[name=show_options]:checked").val();
  var autoclose_tab = $("input:radio[name=autoclose_tab]:checked").val();
  var success_sound = $("#success_sound_select").val();
  chrome.storage.sync.set({
    "habitica_todo_user_id":       user_id,
    "habitica_todo_api_token":     api_token,
    "habitica_todo_add_days":      add_days,
    "habitica_todo_difficulty":    difficulty,
    "habitica_todo_prefix":        prefix,
    "habitica_todo_suffix":        suffix,
    "habitica_todo_show_options":  show_options,
    "habitica_todo_autoclose_tab": autoclose_tab,
    "habitica_todo_success_sound": success_sound
  }, function() {
    if (chrome.runtime.error) {
      $("#status")
        .finish()
        .show()
        .text(chrome.runtime.error);
    } else {
      $("#save")
        .addClass("btn-success")
        .removeClass("btn-warning")
        .text("SAVED!");
      setTimeout(function() {
        $("#save")
          .addClass("btn-warning")
          .removeClass("btn-success")
          .text("SAVE SETTINGS");
      }, 5000);
    }
  });
});
