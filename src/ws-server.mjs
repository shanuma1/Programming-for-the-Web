import assert from 'assert';
//import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import querystring from 'querystring';

import ModelError from './model-error.mjs';

//not all codes necessary
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

const BASE = 'api';

export default function serve(port, meta, model) {
  const app = express();
  app.locals.port = port;
  app.locals.meta = meta;
  app.locals.model = model;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

function setupRoutes(app) {
  //app.use(cors());

  //pseudo-handlers used to set up defaults for req
  app.use(bodyParser.json());      //always parse request bodies as JSON
  app.use(reqSelfUrl, reqBaseUrl); //set useful properties in req

  //application routes
  app.get(`/${BASE}`, doBase(app));
  //@TODO: add other application routes
  app.post(`/${BASE}/carts`, doPostCart(app));
  app.get(`/${BASE}/carts/:id`, doGetCart(app));
  app.patch(`/${BASE}/carts/:id`, doUpdateCart(app));
  app.get(`/${BASE}/books`, doFind(app));
  app.get(`/${BASE}/books/:id`, doFindIsbn(app));
  //must be last
  app.use(do404(app));
  app.use(doErrors(app));
}

/****************************** Handlers *******************************/

/** Sets selfUrl property on req to complete URL of req,
 *  including query parameters.
 */
function reqSelfUrl(req, res, next) {
  const port = req.app.locals.port;
  req.selfUrl = `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
  next();  //absolutely essential
}

/** Sets baseUrl property on req to complete URL of BASE. */
function reqBaseUrl(req, res, next) {
  const port = req.app.locals.port;
  req.baseUrl = `${req.protocol}://${req.hostname}:${port}/${BASE}`;
  next(); //absolutely essential
}

function doBase(app) {
  return function(req, res) { 
    try {
      const port = req.app.locals.port;
      const links = [
	{ rel: 'self', name: 'self', href: req.selfUrl, },
  { rel: 'collection', name: 'books', href: `${req.protocol}://${req.hostname}:${port}/${BASE}/books`},
  { rel: 'collection', name: 'carts', href: `${req.protocol}://${req.hostname}:${port}/${BASE}/carts`},  
      ];
      res.json({ links });
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  };
}

//@TODO: Add handlers for other application routes
function doPostCart(app) {
  return async function(req, res) {
    try{
      const vari = res.body;
      const port = req.app.locals.port;
      const results = await app.locals.model.newCart(vari)
      res.append("Location", `${req.protocol}://${req.hostname}:${port}/${BASE}/carts/` + results)
      res.sendStatus(CREATED);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  }
}

function doGetCart(app) {
  return async function(req, res) {
    try  {
      const id = req.params.id;
      const port = req.app.locals.port;
      const results = await app.locals.model.getCart({ cartId: id });
      if (results.length === 0) {
        throw  {
          isDomain: true,
          errorCode: "NOT_FOUND",
          message: `cart ${id} not found`
        };
      } else {
       
        const job = JSON.parse(JSON.stringify(results))
        const result = {_lastModified: job['_lastModified']}
        const que = []
        for (const k in job) {
          if (k != "_lastModified") {
            que.push({
              links:[{
                href: `${req.protocol}://${req.hostname}:${port}/${BASE}/books/` + k,
                name: "book",
                rel: "item",
              }],
              nUnits: job[k],
              sku: k,
            })
          }
        }
        Object.assign(result, {"links":[{
          "href":  `${req.protocol}://${req.hostname}:${port}/${BASE}/carts/` + id,
          "name": "self",
          "rel" : "self",
        }], 'results':que})
        res.json(result);
      }
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  }
}

function doUpdateCart(app) {
  return async function(req, res) {
    try {
      const patch = Object.assign({}, req.body);
      patch.cartId = req.params.id;
      const results = await app.locals.model.cartItem(patch);
      res.sendStatus(OK);
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  }
}

function doFind(app) {
  return async function(req, res) {
    try {
      const data = Object.assign({}, req.body)
      const patch = {}
      const port = req.app.locals.port;
      if(req.query.authorsTitleSearch) Object.assign(patch, {authorsTitleSearch: req.query.authorsTitleSearch})
      else {
        const err = {
          "errors" : [
             {
                "code" : "FORM_ERROR",
                "message" : "At least one search field must be specified.",
                "name" : ""
             }
          ],
          "status" : 400
       }
       res.status(400).send(err)
      }
      if(req.query._index) Object.assign(patch, {_index: req.query._index})
      else Object.assign(patch, {_index: 0})
      if(req.query._count) Object.assign(patch, {_count: req.query._count + 1})
      else Object.assign(patch, {_count: 6})
      if(req.query.isbn) Object.assign(patch, {isbn: req.query.isbn})
      const results = await app.locals.model.findBooks(patch)
     
      const links = [{
        "href":  `${req.protocol}://${req.hostname}:${port}` + req.url,
        "name": "self",
        "rel" : "self",
      }]
      const author = req.query.authorsTitleSearch ? `authorsTitleSearch=${req.query.authorsTitleSearch}` : ""
      let count = req.query._count ? `&_count=${req.query._count}` : ""
      const c = parseInt(req.query._count, 10) || 5;
      if (results.length > 5 || results.length > req.query._count) {
        const index = req.query._index ? `&_index=${parseInt(req.query._index, 10)+c}` : `&_index=${c}`
        const next_link = {
            "href":  `${req.protocol}://${req.hostname}:${port}/${BASE}/books?${author}${index}${count}`,
            "name": "next",
            "rel" : "next", }
        links.push(next_link)
        results.splice(-1)
      }
      if (req.query._index > 0) {
        const index = `_index=${req.query._index-c >= 0 ? req.query._index-c : 0}`
        req.query._index = 0
        const prev_link = {
          "href":  `${req.protocol}://${req.hostname}:${port}/${BASE}/books?${author}&${index}&${count}`,
          "name": "prev",
          "rel" : "prev", }
      links.push(prev_link)
      }
        for (let k of results) {
          k.links = {href: `${req.protocol}://${req.hostname}:${port}/books/${k.isbn}`,
                      name: "book",
                      rel: "details"}
        }
        const dat = Object.assign({}, {links: links, results:[results]})
        res.json(dat);
      
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json
    }
  }
}

function doFindIsbn(app) {
  return async function(req, res, next) {
    try {
      const port = req.app.locals.port;
      
      const results = await app.locals.model.findBooks(Object.assign({}, {"isbn":req.params.id}))
      if (results.length === 0) {
         
        const err = {
           "errors" : [
              {
                 "code" : "BAD_ID",
                 "message" : `no book for isbn ${req.params.id}`,
                 "name" : "isbn"
              }
           ],
           "status" : 404
        }
        res.status(404).send(err)
      } else {
        for (let k of results) {
          k.links = {href: `${req.protocol}://${req.hostname}:${port}/books/${k.isbn}`,
                      name: "book",
                      rel: "details"}
        }
        const dat = Object.assign({}, {links:{
          "href":  `${req.protocol}://${req.hostname}:${port}` + req.url,
          "name": "self",
          "rel" : "self",
        }, results:[results]})
        res.json(dat);
      }
    } catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json
    }
  }
}
/** Default handler for when there is no route for a particular method
 *  and path.
 */
function do404(app) {
  return async function(req, res) {
    const message = `${req.method} not supported for ${req.originalUrl}`;
    const result = {
      status: NOT_FOUND,
      errors: [	{ code: 'NOT_FOUND', message, }, ],
    };
    res.type('text').
	status(404).
	json(result);
  };
}


/** Ensures a server error results in nice JSON sent back to client
 *  with details logged on console.
 */ 
function doErrors(app) {
  return async function(err, req, res, next) {
    const result = {
      status: SERVER_ERROR,
      errors: [ { code: 'SERVER_ERROR', message: err.message } ],
    };
    res.status(SERVER_ERROR).json(result);
    console.error(err);
  };
}


/*************************** Mapping Errors ****************************/

const ERROR_MAP = {
  BAD_ID: NOT_FOUND,
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code and an errors property containing list of error objects
 *  with code, message and name properties.
 */
function mapError(err) {
  const isDomainError =
    (err instanceof Array && err.length > 0 && err[0] instanceof ModelError);
  const status =
    isDomainError ? (ERROR_MAP[err[0].code] || BAD_REQUEST) : SERVER_ERROR;
  const errors =
	isDomainError
	? err.map(e => ({ code: e.code, message: e.message, name: e.name }))
        : [ { code: 'SERVER_ERROR', message: err.toString(), } ];
  if (!isDomainError) console.error(err);
  return { status, errors };
} 

/****************************** Utilities ******************************/

/** Return original URL for req */
function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}

