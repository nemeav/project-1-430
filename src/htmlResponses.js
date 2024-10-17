// mod imports
const fs = require('fs');
// other mile imports
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/styles.css`);

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

// add styles... bc i kept forgetting
const getCss = (request, response) => {
  respond(request, response, css, 'text/css');
};

// EXPORTS
module.exports = {
  getIndex,
  getCss,
};
