// Map datatype & value for parameters of a Stored Procedure, from Master list in paramTypes.js

const paramTypes = require('./paramTypes');
//
function bindParams(request, paramValues) {
  
 /* console.log('Inside bindParams. Type of request:', typeof request);
  console.log('Does request.input exist?', typeof request.input); */

  for (const [key, value] of Object.entries(paramValues)) {
    const type = paramTypes[key];
    if (type) {
      request.input(key, type, value ?? null);
    } else {
      request.input(key, value ?? null); // fallback if type not defined
    }
  }
  return request;
 
}

module.exports = bindParams;
