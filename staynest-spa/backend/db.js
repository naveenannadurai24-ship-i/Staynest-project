/* ===========================================================
   db.js — tiny JSON-file "database" so data survives restarts
   without needing to install Postgres/MongoDB. Swap this for
   a real database in production.
=========================================================== */
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "db.json");

const SEED_LISTINGS = require("./seed-listings.json");

function load(){
  if(!fs.existsSync(DB_FILE)){
    const initial = { listings: SEED_LISTINGS, bookings: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function save(data){
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
