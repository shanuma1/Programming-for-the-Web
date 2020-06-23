$(function() {

  //const WIDGETS = [ 'html', 'script' ];

  function update() {
    $('div.html').html($('textarea.html').val());
    const code = $('input.script').val();
    const script = `<script>${code}</script>`;
    $('head').append(script);
  }

  function setup() {
    //WIDGETS.forEach((id) => $(`textarea.${id}`).val($(`div.${id}`).html()));
    $('textarea.html').val($('div.html').html());
  }

  function go() {
    $('form#dom-play').submit(function(event) {
      update();
      event.preventDefault();
    });
    setup();
  }

  go();
});


  
