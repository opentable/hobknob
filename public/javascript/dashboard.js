var toggleSwitch = function() {
  $('.toggleswitch').toggleSwitch({
    onClick: function (event) {
      console.log('Toggle Switch was clicked');
      var toggle = this.closest('input#toggle');
      if (toggle.hasClass('disabled')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });
};


$(document).ready(function() {
  
  // This is a fix/hack because bs modal only loads on page render http://stackoverflow.com/questions/12286332/twitter-bootstrap-remote-modal-shows-same-content-everytime
  $('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
  });
  
  toggleSwitch();

});

