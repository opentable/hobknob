$(document).ready(() => {
  // This is a fix/hack because bs modal only loads on page render http://stackoverflow.com/questions/12286332/twitter-bootstrap-remote-modal-shows-same-content-everytime
  $('body').on('hidden.bs.modal', '.modal', () => {
    $(this).removeData('bs.modal');
  });
});

