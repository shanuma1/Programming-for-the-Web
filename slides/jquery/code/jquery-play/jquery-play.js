$(function() {

  function update() {
    $('div.html').html($('textarea.html').val());
    const code = $('input.script').val();
    const script = `<script>${code}</script>`;
    $('head').append(script);
  }

  function setup() {
    $('textarea.html').val($('div.html').html());
  }

  function go() {
    $('form#jquery-play').submit(function(event) {
      update();
      event.preventDefault();
    });
    setup();
  }

  go();
});


  
