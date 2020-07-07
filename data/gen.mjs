#!/usr/bin/env node

import assert from 'assert';
import fs from 'fs';
import Path from 'path';

//this script can generate duplicate titles

function makeBooks(n) {
  const people = new People(n);
  const booksMap = {};
  makeBookTitles(n).forEach(title => {
    let isbn;
    do {
      isbn = String(Math.random()).slice(2, 12).replace(/\d{3}/g, '$&-');
    } while (booksMap[isbn] !== undefined);
    booksMap[isbn] = {
      title,
      authors: people.randAuthors(),
      isbn,
      pages: 80 + Math.round(520*Math.random()),
      year: 2000 + Math.round(20*Math.random()),
      publisher: PUBLISHERS[Math.trunc(Math.random() * PUBLISHERS.length)],
    };
  });
  const values = Object.values(booksMap);
  const books = [];
  while (books.length < n) {
    const i = Math.trunc(values.length * Math.random());
    books.push(values.splice(i, 1)[0]);    
  }
  return books;
}

function makeBookTitles(n) {
  const titles = [];
  const countLangs = new Set(); //track langs with restricted counts
  for (const lang of TOP_LANGS) {
    titles.push(...langTitles(lang, countLangs));
  }
  const nLangs = LANGS.length;
  while (titles.length < n) {
    const lang = LANGS[Math.floor(nLangs*Math.random())];
    titles.push(...langTitles(lang, countLangs));
  }
  return titles;
}

//Languages whose names start with these letters are restricted to
//this many books
const LANG_COUNT = {
  a: 1,
  b: 3,
  c: 5,
  d: 6,
  e: 8,
  f: 10,
  g: 11,  
};

function langTitles(lang, countLangs) {
  let count = LANG_COUNT[lang[0].toLowerCase()];
  if (count !== undefined) {
    if (countLangs.has(lang)) {
      return [];
    }
    else {
      countLangs.add(lang);
    }
  }
  else {
    const [min, max] = [3, 15];
    count = min + Math.round(Math.random() * (max - min));
  }
  return randChoices(TITLES, count).map(title => title.replace('$', lang));
}

const PEOPLE_PATH =
      Path.join(process.env['HOME'],
		'projects/courses/cs551-12f/projects/prj1/files',
		'people.csv');
const MIN_AUTHORS = 1;
const MAX_AUTHORS = 4;
class People {

  constructor(nBooks, path=PEOPLE_PATH) {
    const [firstNames, lastNames] = People._readNames(path);
    const [nFirst, nLast] = [firstNames.length, lastNames.length];
    const nAuthors = Math.trunc(nBooks*0.5); //ensure authors have > 1 book
    assert(nAuthors < nFirst*nLast);
    const authors = new Set();
    while (authors.size < nAuthors) {
      const first = firstNames[Math.trunc(Math.random()*nFirst)];
      const last = lastNames[Math.trunc(Math.random()*nLast)];
      authors.add(`${last}, ${first}`);
    }
    this.authors = [...authors];
    this.nAuthors = nAuthors;
  }

  randAuthors() {
    const nAuthors =
	  MIN_AUTHORS + Math.round(Math.random()*(MAX_AUTHORS-MIN_AUTHORS));
    const authors = new Set();
    while (authors.size < nAuthors) {
      const author = this.authors[Math.trunc(Math.random()*this.nAuthors)];
      authors.add(author);
    }
    return [ ...authors ];
  }
  
  static _readNames(path) {
    const firstNames = new Set();
    const lastNames = new Set();
    fs.readFileSync(path, 'utf8').
      split('\n').
      filter(line => line.match(/^\d{3}-\d{2}-\d{4},/)).
      forEach(line => {
	const fields = line.split(/,/);
	firstNames.add(fields[1]); lastNames.add(fields[3]);
      });
    return [[...firstNames], [...lastNames]];
  }

}

const PUBLISHERS = [
  "O'Reilly",
  "Manning",
  "Prentice-Hall",
  "Addison-Wesley",
  "New Starch",
  "Pearson",
];

const TITLES = [
  "The Idiot's Guide to $",
  "Basics of $ Programming",
  "Fundamentals of $ Programming",
  "$ Reference Manual",
  "$ Programmers Reference",
  "$: The Good Parts",
  "$: The Definitive Guide",
  "Programming in $",
  "Advanced $ Programming",
  "Intermediate $ Programming",
  "$ Prats and Pitfalls",
  "The ABC's of $ Programming",
  "$ Programming Made Easy",
  "$ Simplified",
  "$ In Action",
  "Elements of $ Programming",
  "Progmatics of $ Programming",
];

function randChoices(choices, n) {
  const chosen = new Set();
  assert(n <= choices.length);
  const len = choices.len;
  while (chosen.size < n) {
    chosen.add(choices[Math.trunc(n*Math.random())]);
  }
  return [...chosen];
}



//derived from https://www.edureka.co/blog/top-10-programming-languages/
const TOP_LANGS = [
  'Python',
  'JavaScript',
  'Java',
  'Swift',
  'Go',
  'C',
  'C#',
  'C++',
  'Scala',
  'Ruby',
  'Rust',
];

//derived from https://www.whoishostingthis.com/resources/programming/
const LANGS = TOP_LANGS.concat([
  'ActionScript',
  'Ada',
  'ALGOL',
  'Alice',
  'APL',
  'Awk',
  'Bliss',
  'COBOL',
  'D',
  'Delphi',
  'Dreamweaver',
  'Erlang',
  'Elixir',
  'F#',
  'FORTH',
  'FORTRAN',
  'Haskell',
  'INTERCAL',
  'Lisp',
  'Logo',
  'ML',
  'Modula-3',
  'Objective-C',
  'OCaml',
  'Pascal',
  'Perl',
  'PHP',
  'PL/I',
  'PL/SQL',
  'PostgreSQL',
  'PostScript',
  'PROLOG',
  'R',
  'RapidWeaver',
  'RavenDB',
  'Rexx',
  'SAS',
  'Scheme',
  'Sed',
  'Shell  ',
  'Simula',
  'Smalltalk',
  'SNOBOL',
  'Tcl/Tk',
  'Verilog',
  'VHDL',
  'Visual Basic',
]);

if (process.argv.length !== 3 || !process.argv[2].match(/^\d+$/)) {
  console.error(`${Path.basename(process.argv[1])} N_BOOKS`);
  process.exit(1);
}
const n = Number(process.argv[2]);
//console.log(JSON.stringify(makeBookTitles(n), null, 2));
console.log(JSON.stringify(makeBooks(n), null, 2));

