const config = {
  user: 'optMngmntAdmin',
  password: 'OperationGame1234',
  server: "MP-BOOK\\SQLEXPRESS", // e.g., localhost
  database: 'OpsMgt',
  options: {
    encrypt: false, // Use true if you're on Windows Azure
    trustServerCertificate: true // Use true for local dev / self-signed certs
  }
};

module.exports = config;
