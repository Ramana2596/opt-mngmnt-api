const config = {
  user: 'optMngmntAdmin',
  password: 'OperationGame1234',
  server: "GITASIVA\\SQLEXPRESS", // e.g., localhost
  database: 'OpsMgt',
  options: {
    encrypt: false, // Use true if you're on Windows Azure
    trustServerCertificate: true, // Use true for local dev / self-signed certs
    requestTimeout: 180000 ,    // Set SQL request timeout to 3 minutes (180,000ms)
  },
  pool: {
    max: 10, // simultaneous database connections
    min: 0,
    idleTimeoutMillis: 30000   // Close idle connections after 30 seconds
  }
};

module.exports = config;

/*
const config = {
  user: 'optMngmntAdmin',
  password: 'OperationGame1234',
  server: "GITASIVA\\SQLEXPRESS", // e.g., localhost
  database: 'OpsMgt',
  options: {
    encrypt: false, // Use true if you're on Windows Azure
    trustServerCertificate: true // Use true for local dev / self-signed certs
  }
};

*/
