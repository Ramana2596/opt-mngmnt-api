const express = require('express');
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const cors = require('cors');
const sqlConfig = require('./dbConfig');
const app = express();
const port = process.env.PORT || 4000;

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

// Recursively load all route files from the opt-mngmnt directory and its sub-directories
const loadRoutes = (directory) => {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      // Recursively load routes from sub-directories
      loadRoutes(fullPath);
    } else {
      // Check if the file exports a function
      const route = require(fullPath);
      if (typeof route === 'function' || route instanceof express.Router) {
        app.use('/api', route);
      } else {
        console.error(`Invalid middleware in file: ${fullPath}`);
      }
    }
  });
};

const routesPath = path.join(__dirname, 'opt-mngmnt');
loadRoutes(routesPath);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
