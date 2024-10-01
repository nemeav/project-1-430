// mod imports
const fs = require('fs');
// other mile imports
const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// PROCESS CONTENT
const respond = (request, response, location, type) => {
  response.writeHead(200, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(location, 'utf8'),
  });
  response.write(location);
  response.end();
};

// FUNCS FOR DIFF FILES
// LOAD CLIENT PAGE
const getIndex = (request, response) => {
  respond(request, response, index, 'text/html');
};

// EXPORTS
module.exports = {
  getIndex,
};
