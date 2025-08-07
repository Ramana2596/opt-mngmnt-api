// Map datatype & value for parameters of a Stored Procedure, from Master list in paramTypes.js

const paramTypes = require('./paramTypes');
//
function bindParams(request, paramValues) {
  
 
  console.log('Inside bindParams.js');
  console.log('typeof request:', typeof request); // Expect: 'object'
  console.log('typeof request.input:', typeof request.input); // Expect: 'function'
  //console.trace(); // Logs stack trace to identify caller
  console.log('bindParams called from:', new Error().stack.split('\n')[2].trim());


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


