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
function makeId(path) { return ('/' + path.join('/')); }

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

//@TODO

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
    //@TODO
    // const results = ...;
    // console.log(JSON.stringify(results, null, 2));
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
  if(!meta.attr['id']) Object.assign(meta.attr, {id: id_attr})
  const type_attr = meta.subType || "text"
  console.log(type_attr)
  $element.append(makeElement('label', meta.attr).text(meta.text + text))
  const $input_div = makeElement('div')
  $input_div.append(makeElement('input', Object.assign(meta.attr, {type: type_attr})));
  //$input_div.append(makeElement('div', Object.assign({}, {class: "error"}, {id: id_attr+'-err'})).text('The field Search Terms must be Specified'))
  $input_div.append(makeElement('div', Object.assign({}, {class: "error"})))
  $element.append($input_div)
}

function link(meta, path, $element) {
  const parentType = getType(access(path.concat('..')));
  const { text='', ref=DEFAULT_REF } = meta;
  const attr = Object.assign({}, meta.attr||{}, { href: makeRefUrl(ref) });
  $element.append(makeElement('a', attr).text(text));
}

function multiSelect(meta, path, $element) {
  extractor(meta, path, $element, true, "checkbox")
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
  console.log(meta)
  const $uni_div = makeElement('div')
  const label_id = makeId(path)
  $element.append(makeElement('label', Object.assign({}, {id: label_id})).text(meta.text))
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
    const $field_div = makeElement('div', {class: "fieldset"})
    for (let i  = 0; i < meta.items.length; i++) {
      $field_div.append(makeElement('label', {id: label_id}).text(meta.items[i].key))
      $field_div.append(makeElement('input', Object.assign(meta.attr, {value: meta.items[i].key},
                                 {type: inp_type}, {id: label_id+'-'+i})))
    }
    $uni_div.append($field_div)
  }
  $uni_div.append(makeElement('div', Object.assign({class: "error"}, {id: label_id+'-err'})))
  $element.append($uni_div);
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
