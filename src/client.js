// client-side code
// fetch
// const handleResponse = async (response, content) => {
//     const content = document.querySelector(`${content}`);
//     const resText = await response.text();

//     // clear for clarity - not sure if necessary though...
//     content.innerHTML = '';

//     // header titles based on status code
//     switch (response.status) {
//       case 200:
//         content.innerHTML = JSON.stringify(response);
//         break;
//       case 201:
//         content.innerHTML = '<b>Created</b>';
//         break;
//       case 204:
//         content.innerHTML = '<b>Updated (No Content)</b>';
//         return;
//       case 400:
//         content.innerHTML = `<b>Bad Request</b>`;
//         break;
//       case 404:
//       default:
//         content.innerHTML = `<b>Not Found</b>`;
//         break;
//     }

//     // handle page based on response
//     const parsedResponse = JSON.parse(resText);
//     //only show users for /getUsers + GET
//     if (response.method !== 'HEAD' && response.status === 200) {
//       content.innerHTML += `<p>${JSON.stringify(parsedResponse.users)}</p>`;
//     }
//     if (parsedResponse.message) {
//       content.innerHTML += `<p>Message: ${parsedResponse.message}</p>`;
//     }

//     console.log(parsedResponse);
//   };

//   //other funcs
//   const sendGet = async () => {

//     let response = await fetch({
//       headers: {
//         'Accept': 'application/json',
//       },
//     });
//     handleResponse(response);
//   };

const init = () => {
  // init elems
  const randomButton = document.querySelector('#sendRandom');

  // listeners
  randomButton.addEventListener('click', () => {
    console.log('yippeeeee');
  });
};

window.onload = init;

// GET 1 - random

// GET 2 - Vision

// GET 3 - Talents

// GET 4 - Regions

// POST 1 - New char

// POST 2 - Edit Char
