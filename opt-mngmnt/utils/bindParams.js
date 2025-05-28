// datatype mapping for parameters listed in paramTypes.js
const paramTypes = require('./paramTypes');

function bindParams(request, paramValues) {
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
