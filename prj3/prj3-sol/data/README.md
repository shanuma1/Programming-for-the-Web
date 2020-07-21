Synthetic book data:

```
  isbn: String (ID)
  title: String,
  authors: List<String>
  publisher: String
  pages: Integer
  year: Integer
```  

Randomly generated data can contain duplicate titles, but ISBN's will
be unique.

Languages whose names start with these letters are restricted to
this many books:

```
  a: 1
  b: 3
  c: 5
  d: 6
  e: 8
  f: 10
  g: 11
```

Languages whose names start with letters h-z do not have any restriction
for the number of generated books.