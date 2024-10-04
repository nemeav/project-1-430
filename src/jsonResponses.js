// mods
const fs = require('fs');
const url = require('url');
// files
const genshinData = JSON.parse(fs.readFileSync(`${__dirname}/../data/characters.json`));

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();
};

// end points
// random character generator
const getRandom = (request, response) => {
  const randomNum = Math.floor(Math.random() * 89);
  const randomChar = genshinData[randomNum];
  const responseJSON = {
    randomChar,

    message: 'This is a successful response',
  };
  respondJSON(request, response, 200, responseJSON);
};

// get chars by vision type
const getVisions = (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const { query } = parsedUrl;

  let responseJSON;

  switch (query.vision) {
    case 'pyro':
      responseJSON = genshinData.filter((char) => char.vision === 'Pyro');
      break;
    case 'hydro':
      responseJSON = genshinData.filter((char) => char.vision === 'Hydro');
      break;
    case 'anemo':
      responseJSON = genshinData.filter((char) => char.vision === 'Anemo');
      break;
    case 'electro':
      responseJSON = genshinData.filter((char) => char.vision === 'Electro');
      break;
    case 'dendro':
      responseJSON = genshinData.filter((char) => char.vision === 'Dendro');
      break;
    case 'cryo':
      responseJSON = genshinData.filter((char) => char.vision === 'Cryo');
      break;
    case 'geo':
      responseJSON = genshinData.filter((char) => char.vision === 'Geo');
      break;
    default:
      responseJSON = {
        message: 'Internal error. Something went wrong.',
        id: 'internalError',
      };
      respondJSON(request, response, 400, responseJSON);
  }
  respondJSON(request, response, 200, responseJSON);
};

// error page
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getRandom,
  getVisions,
  notFound,
};
