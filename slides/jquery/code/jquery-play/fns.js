const fns = (function() {
  const fns = {};

  const select = fns.select = function ($elements) {
    $elements.css('backgroundColor', 'yellow');
  }
  
  fns.f1 = () => select($('dt'));

  fns.f2 = () => select($('#bart'));

  fns.f3 = () => select($('.catchphrases'));

  fns.f4 = () => select($('#bart+dd .fullName'));

  fns.f5 = () => select($('.characters dt:odd'));

  fns.f6 = () => select($('.properties dt:nth-child(4n+1)'));
  
  return fns;
})();
