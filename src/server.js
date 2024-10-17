// mods
const http = require('http');
const query = require('querystring');
// files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/styles.css': htmlHandler.getCss,
  '/getRandom': jsonHandler.getRandom,
  '/getVisions': jsonHandler.getVisions,
  '/getRegion': jsonHandler.getRegion,
  '/getTalents': jsonHandler.getTalents,
  '/addChar': jsonHandler.addChar,
  '/editChar': jsonHandler.editChar,
};

// handles/organizes body packets
const parseBody = (request, response, handler) => {
  const body = [];

  // error handling if anything's missing/breaks
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // when data received, push to body array
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // after all data collected, make obj and call func to process
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);
    handler(request, response);
  });
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.query = Object.fromEntries(parsedUrl.searchParams);

  // check for methods to call proper funcs
  if (request.method === 'HEAD' && urlStruct[parsedUrl.pathname]) {
    response.writeHead(200);
    response.end();
  } else if (request.method === 'POST' && urlStruct[parsedUrl.pathname]) {
    parseBody(request, response, urlStruct[parsedUrl.pathname]);
  } else if (request.method === 'GET' && urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// server start
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
