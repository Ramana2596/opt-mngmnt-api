
// centralized parameter dictionary
const sql = require('mssql');
// This file defines List of Parameter (Key) Versus Data type ,  used in various SQL queries
const paramTypes = {
  Game_Id: sql.NVarChar(20),
  Game_Batch: sql.Int,
  Game_Team: sql.NVarChar(10)
  // Add more params as needed
};

module.exports = paramTypes;
