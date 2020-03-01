// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const scraper = require("./stock-scraper.js")
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/stockBase.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Stock (id INTEGER PRIMARY KEY AUTOINCREMENT, vendor TEXT, partNo TEXT, stock INTEGER)"
    );
    console.log("Stock table created");
  } else {
    console.log('Database "Stock" ready to go!');
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the dreams in the database
app.get("/getAllRecords", (request, response) => {
  db.all("SELECT * from Stock", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

app.get("/getStock/:vendor/:id", async (req, res) => {
  const stock = await scraper.getStock(req.params.vendor,req.params.id)
  res.send(stock?{vendor:req.params.vendor,id:req.params.id,stock:stock}:{error:"Unknown ID/Vendor"});
});

app.get("/addMonitor/:vendor/:id", async (req, res) => {
  const stock = await scraper.getStock(req.params.vendor,req.params.id)
  if(stock)
  res.send(stock?{vendor:req.params.vendor,id:req.params.id,stock:stock}:{error:"Unknown ID/Vendor"});
});

// endpoint to add a dream to the database
app.post("/addDream", (request, response) => {
  console.log(`add to dreams ${request.body.dream}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects
  // so they can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedDream = cleanseString(request.body.dream);
    db.run(`INSERT INTO Dreams (dream) VALUES (?)`, cleansedDream, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});


// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});