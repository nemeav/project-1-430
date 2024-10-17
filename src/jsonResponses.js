// mods
const fs = require('fs');
// files
const genshinData = JSON.parse(fs.readFileSync(`${__dirname}/../data/characters.json`));
// variables used by multiple funcs
let statusCode;
let responseJSON = {};

// process file ()
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // get vs head differentiation
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }
  response.end();
};

// end points
// random character generator
const getRandom = (request, response) => {
  const randomNum = Math.floor(Math.random() * (genshinData.length - 1));
  responseJSON = genshinData[randomNum];
  respondJSON(request, response, 200, responseJSON);
};

// get chars by vision type
const getVisions = (request, response) => {
  // send data based on query param in endpoint
  request.query.vision = request.query.vision.charAt(0).toUpperCase()
    + request.query.vision.slice(1).toLowerCase();
  responseJSON = genshinData.filter((char) => char.vision === request.query.vision);
  respondJSON(request, response, 200, responseJSON);
};

// get character's talents by name
// couldn't test without client side - hoping for the best
const getTalents = (request, response) => {
  const name = request.query.name.trim();
  const character = genshinData.filter((c) => c.name === name || (c['alternate names'] && c['alternate names'].includes(name)));

  // checks if the user entered a valid character/alias, handles accordingly
  if (character.length === 1) {
    responseJSON = character[0].talents;
    statusCode = 200;
    // if user entered family name instead of first name...
  } else if (character.length > 1) {
    // putting them in an array prevented [object Object] issue
    responseJSON = [];

    for (let i = 0; i < character.length; i++) {
      responseJSON.push({
        name: character[i].name,
        talents: character[i].talents,
      });
    }
    statusCode = 200;
  } else {
    responseJSON = {
      message: 'Character not found. Check spelling and capitalization. Remember to use given name!',
      id: 'invalidName',
    };
    statusCode = 400;
  }
  console.log(responseJSON);
  return respondJSON(request, response, statusCode, responseJSON);
};

// get characters by their (vision) region
const getRegion = (request, response) => {
  // send data based on query param in endpoint
  request.query.region = request.query.region.charAt(0).toUpperCase()
    + request.query.region.slice(1).toLowerCase();

  responseJSON = genshinData.filter((char) => char.region === request.query.region);
  respondJSON(request, response, 200, responseJSON);
};

// post a new character to genshinData (OC/characters released after 5.0 + Xilonen)
const addChar = (request, response) => {
  const {
    name, vision, weapon, region, rarity, basic, skill, burst,
  } = request.body;
  // checks if the user created a valid character, handles accordingly
  if (name && vision && weapon && region && rarity && basic && skill && burst) {
    responseJSON.message = 'Created successfully';
    statusCode = 201;
    genshinData[name] = {
      name,
      vision,
      weapon,
      region,
      rarity,
      talent: {
        basic,
        skill,
        burst,
      },
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
  // Processing from clientside
  const {
    name, vision, weapon, region, rarity, basic, skill, burst,
  } = request.body;

  // Default response for non-existent character
  responseJSON = {
    message: 'Character does not exist. Check spelling or try Create a Character',
    id: 'badRequestInvalidName',
  };

  // Find the character by name
  const character = genshinData.find((c) => c.name === name.trim());

  if (!character) {
    return respondJSON(request, response, 400, responseJSON);
  }

  // Update fields if provided
  if (vision) character.vision = vision;
  if (weapon) character.weapon = weapon;
  if (region) character.region = region;
  if (rarity) character.rarity = rarity;
  if (basic && skill && burst) {
    character.talents = { basic, skill, burst };
  }

  console.log('Updated character:', character); // something definitely happens but don't have anyway to add to clientside

  response.writeHead(204); // best I got; respondJSON not working w/ 204 like in old proj
  response.end();
  return null;
};

// error page
const notFound = (request, response) => {
  responseJSON = {
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
