const express = require('express');
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const cors = require('cors');
const sqlConfig = require('./dbConfig');
const app = express();
const port = 4000;

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

sql.connect(sqlConfig, err => {
   if (err) {
     console.error('Database connection failed:', err);
     return;
   }
   console.log('Connected to SQL Server');
 });

// Dynamically load all route files
const routesPath = path.join(__dirname, 'opt-mngmnt');
fs.readdirSync(routesPath).forEach(file => {
  const route = require(path.join(routesPath, file));
  app.use('/api', route);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
