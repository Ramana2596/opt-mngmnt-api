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
// Ensure preflight requests are handled with CORS headers
app.options('*', cors());

// Make initial DB connect attempt but don't allow rejections to bubble
sql.connect(sqlConfig)
  .then(() => console.log('Connected to SQL Server'))
  .catch(err => console.error('Database connection failed:', err));

// Prevent unhandled promise rejections from crashing the process while
// developers debug DB/remote issues (logs the error instead)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Recursively load all route files from the opt-mngmnt directory and its sub-directories
const loadRoutes = (directory) => {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      // Recursively load routes from sub-directories
      loadRoutes(fullPath);
      return;
    }

    // Only attempt to require JavaScript files
    if (path.extname(file).toLowerCase() !== '.js') {
      // skip non-JS files (e.g., function.json)
      return;
    }

    try {
      const route = require(fullPath);
      if (typeof route === 'function' || route instanceof express.Router) {
        app.use('/api', route);
      } else {
        console.error(`Invalid middleware in file: ${fullPath}`);
      }
    } catch (err) {
      console.error(`Failed to load route ${fullPath}:`, err.message || err);
    }
  });
};

const routesPath = path.join(__dirname, 'opt-mngmnt');
loadRoutes(routesPath);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
