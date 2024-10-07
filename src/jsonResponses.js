// mods
const fs = require('fs');
const url = require('url');
// files
const genshinData = JSON.parse(fs.readFileSync(`${__dirname}/../data/characters.json`));
// variables used by multiple funcs
let statusCode = 200;

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
  // send data based on query param in endpoint
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
        message: 'Invalid parameter. Enter a valid vision element.',
        id: 'badRequest',
      };
      statusCode = 400;
  }
  respondJSON(request, response, statusCode, responseJSON);
};

// get character's talents by name
// couldn't test without client side - hoping for the best
const getTalents = (request, response) => {
  let responseJSON;
  const { name } = request.body;
  // checks if the user entered a valid character, handles accordingly
  if (genshinData[name]) {
    responseJSON = genshinData[name].talents;
    statusCode = 200;
  } else {
    responseJSON = {
      message: 'Character not found. Check spelling and capitalization. Remember to use given name!',
      id: 'invalidName',
    };
    statusCode = 400;
  }
  return respondJSON(request, response, statusCode, responseJSON);
};

// get characters by their (vision) region
const getRegion = (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const { query } = parsedUrl;
  let responseJSON;
  // send data based on query param in endpoint
  switch (query.region) {
    case 'Mondstadt':
      responseJSON = genshinData.filter((char) => char.region === 'Mondstadt');
      break;
    case 'Liyue':
      responseJSON = genshinData.filter((char) => char.region === 'Liyue');
      break;
    case 'Inazuma':
      responseJSON = genshinData.filter((char) => char.region === 'Inazuma');
      break;
    case 'Sumeru':
      responseJSON = genshinData.filter((char) => char.region === 'Sumeru');
      break;
    case 'Fontaine':
      responseJSON = genshinData.filter((char) => char.region === 'Fontaine');
      break;
    case 'Natlan':
      responseJSON = genshinData.filter((char) => char.region === 'Natlan');
      break;
    case 'Snezhnaya':
      responseJSON = genshinData.filter((char) => char.region === 'Snezhnaya');
      break;
    case 'other':
      responseJSON = genshinData.filter((char) => char.region === 'N/A');
      break;
    default:
      responseJSON = {
        message: 'Invalid parameter. Enter a valid region.',
        id: 'badRequest',
      };
      statusCode = 400;
  }
  respondJSON(request, response, statusCode, responseJSON);
};

// post a new character to genshinData (OC/characters released after 5.0)
const addChar = (request, response) => {
  let responseJSON;
  const {
    newName, vision, weapon, region, rarity, basic, skill, burst,
  } = request.body;
  // checks if the user created a valid character, handles accordingly
  if (newName && vision && weapon && region && rarity && basic && skill && burst) {
    responseJSON.message = 'Created';
    statusCode = 201;
    genshinData[newName] = {
      name: newName,
      vision,
      weapon,
      region,
      rarity,
      basic,
      skill,
      burst,
    };
  } else {
    responseJSON = {
      message: 'All fields required.',
      id: 'addCharMissingParams',
    };
    statusCode = 400;
  }
  return respondJSON(request, response, statusCode, responseJSON);
};

// edit a char in genshinData
const editChar = (request, response) => {
  let responseJSON;
  const {
    editName, editVision, editWeapon, editRegion, editRarity, editBasic, editSkill, editBurst,
  } = request.body;
  // checks if the user created a valid character, handles accordingly
  if (genshinData[editName]) {
    responseJSON.message = 'Updated Successfully';
    statusCode = 204;
    genshinData[editName] = {
      vision: editVision,
      weapon: editWeapon,
      region: editRegion,
      rarity: editRarity,
      basic: editBasic,
      skill: editSkill,
      burst: editBurst,
    };
  } else {
    responseJSON = {
      message: 'Character does not exist. Check spelling or try Create a Character',
      id: 'invalidName',
    };
    statusCode = 400;
  }
  return respondJSON(request, response, statusCode, responseJSON);
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
  getTalents,
  getRegion,
  addChar,
  editChar,
  notFound,
};
