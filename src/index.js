import './style.css';

import $ from 'jquery';        //make jquery() available as $
import Meta from './meta.js';  //bundle the input to this program

//default values
const DEFAULT_REF = '_';       //use this if no ref query param
const N_UNI_SELECT = 4;        //switching threshold between radio & select
const N_MULTI_SELECT = 4;      //switching threshold between checkbox & select

/*************************** Utility Routines **************************/

/** Return `ref` query parameter from window.location */
function getRef() {
  const url = new URL(window.location);
  const params = url.searchParams;
  return params && params.get('ref');
}

/** Return window.location url with `ref` query parameter set to `ref` */
function makeRefUrl(ref) {
  const url = new URL(window.location);
  url.searchParams.set('ref', ref);
  return url.toString();
}

/** Return a jquery-wrapped element for tag and attr */
function makeElement(tag, attr={}) {
  const $e = $(`<${tag}/>`);
  Object.entries(attr).forEach(([k, v]) => $e.attr(k, v));
  return $e;
}

/** Given a list path of accessors, return Meta[path].  Handle
 *  occurrences of '.' and '..' within path.
 */
function access(path) {
  const normalized = path.reduce((acc, p) => {
    if (p === '.') {
      return acc;
    }
    else if (p === '..') {
      return acc.length === 0 ? acc : acc.slice(0, -1)
    }
    else {
      return acc.concat(p);
    }
  }, []);
  return normalized.reduce((m, p) => m[p], Meta);
}

/** Return an id constructed from list path */
function makeId(path) { return (path.join('-')); }

function getType(meta) {
  return meta.type || 'block';
}

/** Return a jquery-wrapped element <tag meta.attr>items</tag>
 *  where items are the recursive rendering of meta.items.
 *  The returned element is also appended to $element.
 */
function items(tag, meta, path, $element) {
  const $e = makeElement(tag, meta.attr);
  (meta.items || []).
    forEach((item, i) => render(path.concat('items', i), $e));
  $element.append($e);
  return $e;
}

/************************** Event Handlers *****************************/



/********************** Type Routine Common Handling *******************/

//@TODO


/***************************** Type Routines ***************************/

//A type handling function has the signature (meta, path, $element) =>
//void.  It will append the HTML corresponding to meta (which is
//Meta[path]) to $element.
function block(meta, path, $element) { items('div', meta, path, $element); }


function form(meta, path, $element) {
  const $form = items('form', meta, path, $element);
  $form.submit(function(event) {
    event.preventDefault();
    const $form = $(this);
    const results = $form.serializeArray();
    let obj = {};
    let x = 0;
    for (x in results) {
      let name = results[x].name;
      let values = results[x].value;
      if ($(`[name="${name}"]`, $form).attr("multiple") || $(`[name="${name}"]`, $form).attr("type") == "checkbox") {
          if(!obj[`${name}`]) {
             obj[`${name}`] = []
             obj[`${name}`].push(values)
          } else obj[`${name}`].push(values);
      } else {
          obj[`${name}`] = values
      }
    }
    $('input,select,textarea', $form).trigger('blur');
    $('input,select', $form).trigger('change');
    if ($(`input[name="primaryColors"]:checked`, $form).length == 0) {
    $('div.fieldset', $form).trigger('change')
    }
    const len = $('.error', $form).length
    let mark = true;
    for (let i = 0; i < len; i++) {
      if ($('.error', $form)[i].innerHTML != "") mark = false;
    }
    if (mark) {
      console.log(JSON.stringify(obj, null, 2));
    }
  });
}

function header(meta, path, $element) {
  const $e = makeElement(`h${meta.level || 1}`, meta.attr);
  $e.text(meta.text || '');
  $element.append($e);
}

function input(meta, path, $element) {
  const text = meta.required ? '*' : ""; 
  const id_attr = makeId(path)
  if(!meta.attr['id']) Object.assign(meta.attr, {for: id_attr})
  const type_attr = meta.subType || "text"
  const fin_text = meta.text ? meta.text + text : "";
  $element.append(makeElement('label', meta.attr).text(fin_text))
  const $input_div = makeElement('div')
  $input_div.append(makeElement('input', Object.assign(meta.attr, {type: type_attr})));
  
  //$input_div.append(makeElement('div', Object.assign({}, {class: "error"}, {id: id_attr+'-err'})).text('The field Search Terms must be Specified'))
  $input_div.append(makeElement('div', Object.assign({id: id_attr+'-err'}, {class: "error"})))
  $element.append($input_div)
  $input_div.on("blur","input", function(event) {
    const str = $(event.target).val().trim();
    if (meta.required && !str) {
      $('#'+id_attr+'-err').text(`The field ${meta.text} must be specified.`)
    } else if('chkFn' in meta && str) {
        if(!meta.chkFn(str)) {
          const errMsg = 'errMsgFn' in meta ?  meta.errMsgFn(str, meta) : `invalid value ${str}`
          $('#'+id_attr+'-err').text(errMsg);
        } else {
          $('#'+id_attr+'-err').text("")
        }
    } else {
      $('#'+id_attr+'-err').text("")
    }
  });
  
}

function link(meta, path, $element) {
  const parentType = getType(access(path.concat('..')));
  const { text='', ref=DEFAULT_REF } = meta;
  const attr = Object.assign({}, meta.attr||{}, { href: makeRefUrl(ref) });
  $element.append(makeElement('a', attr).text(text));
}

function multiSelect(meta, path, $element) {
  extractor(meta, path, $element, true, "checkbox");
}

function para(meta, path, $element) { items('p', meta, path, $element); }

function segment(meta, path, $element) {
  if (meta.text !== undefined) {
    $element.append(makeElement('span', meta.attr).text(meta.text));
  }
  else {
    items('span', meta, path, $element);
  }
}


function submit(meta, path, $element) {
  const attr = Object.assign(meta.attr||{}, { type: 'submit'});
  $element.append(makeElement('div'));
  $element.append(makeElement('button', attr).text(meta.text||"Submit"))
}

function extractor(meta, path, $element, multi, inp_type) {
  const text = meta.required ? '*' : "";
  const $uni_div = makeElement('div')
  const label_id = makeId(path)
  $element.append(makeElement('label', Object.assign({}, {for: label_id})).text(meta.text + text))
  const greater_inp = meta.items.length > Meta._options.N_UNI_SELECT;
  if(greater_inp) {
    let multi_en
    if (multi) multi_en = {multiple: "true"};
    else multi_en = {}
    const $sel = makeElement('select', Object.assign(meta.attr, multi_en));
    for (let i = 0; i < meta.items.length; i++) {
      $sel.append(makeElement('option', Object.assign({}, {value: meta.items[i].key})).text(meta.items[i].text))
    }
    $uni_div.append($sel)
  } else {
    const $field_div = makeElement('div', Object.assign({class: "fieldset"}))
    for (let i  = 0; i < meta.items.length; i++) {
      $field_div.append(makeElement('label', {for: label_id}).text(meta.items[i].key))
      $field_div.append(makeElement('input', Object.assign(meta.attr, {value: meta.items[i].key},
                                 {type: inp_type}, {id: label_id+'-'+i})))
    }
    $uni_div.append($field_div)
  }
  $uni_div.append(makeElement('div', Object.assign({class: "error"}, {id: label_id+"-err"})))
  $element.append($uni_div);
  $uni_div.on("change", function(event) {
    const errorId = '#' + label_id + '-err';
    console.log($(`input[name="primaryColors"]:checked`).length);
    console.log(meta.required)
    console.log(errorId)
    if($(`input[name="primaryColors"]:checked`).length == 0 && meta.required) {
      $(errorId).text(`The field ${meta.text} must be specified.`)
    } else if ($(`input[name="primaryColors"]:checked`).length != 0 && meta.required) {
      $(errorId).text("")
    }
    if (meta.required && !$(event.target).val()) {
      $(errorId).html(`The field ${meta.text} must be specified.`)
    } else {
      $(errorId).text("")
    }
    
    
  });
  
}

function uniSelect(meta, path, $element) {
  extractor(meta, path, $element, false, "radio")
  
}

//map from type to type handling function.  
const FNS = {
  block,
  form,
  header,
  input,
  link,
  multiSelect,
  para,
  segment,
  submit,
  uniSelect,
};

/*************************** Top-Level Code ****************************/

function render(path, $element=$('body')) {
  const meta = access(path);
  if (!meta) {
    $element.append(`<p>Path ${makeId(path)} not found</p>`);
  }
  else {
    const type = getType(meta);
    const fn = FNS[type];
    if (fn) {
      fn(meta, path, $element);
    }
    else {
      $element.append(`<p>type ${type} not supported</p>`);
    }
  }
}

function go() {
  const ref = getRef() || DEFAULT_REF;
  render([ ref ]);
}

go();
