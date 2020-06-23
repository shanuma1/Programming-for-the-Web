const fns = (function() {
  const fns = {};

  function select(...elements) {
    elements.forEach((e) => e.style.backgroundColor = 'yellow');
  }
  
  fns.f1 = () => select(...document.getElementsByTagName('dt'));

  fns.f2 = () => select(document.getElementById('bart'));

  fns.f3 = () => select(...document.getElementsByClassName('catchphrases'));

  fns.f4 = () => select(...document.querySelectorAll('#bart+dd .fullName'));

  return fns;
})();
