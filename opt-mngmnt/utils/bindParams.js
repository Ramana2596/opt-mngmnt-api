// datatype mapping for parameters listed in paramTypes.js
const paramTypes = require('./paramTypes');

function bindParams(request, paramValues) {
  

    console.dir(request, { depth: 1 });
  throw new Error('Debugging request object');
  
 /* console.log('Inside bindParams. Type of request:', typeof request);
  console.log('Does request.input exist?', typeof request.input);

  for (const [key, value] of Object.entries(paramValues)) {
    const type = paramTypes[key];
    if (type) {
      request.input(key, type, value ?? null);
    } else {
      request.input(key, value ?? null); // fallback if type not defined
    }
  }
  return request;
  */
 
}

module.exports = bindParams;
