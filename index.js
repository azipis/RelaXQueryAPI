const http = require('http');
var express = require('express');
var app = express();
var relalg_bundle = require('./relalg_bundle')
const router = require('express').Router()
const bodyParser = require("body-parser");

const executeRelalg = relalg_bundle.executeRelalg;
const Relation = relalg_bundle.Relation;

const hostname = "0.0.0.0";
const port = 3001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('RelaX API up');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/index", (req, res) => {
  // Accessing the sent data from the request body
  const receivedData = req.body;
  console.log("Received data:", receivedData);

  // Extracting specific data fields
  const db = receivedData.database;
  const submittedAnswer = receivedData.submittedAnswer;
  const correctAnswer = receivedData.correctAnswer;

  // Perform any processing you need with the data

  const dbArray = db.split(";");
  const dataset = [dbArray.length];
  for (var i = 0; i < dbArray.length; i++) {
      dataset[i] = executeRelalg(dbArray.at(i), {});
  }

  var dataStuff = {};
  for (var i = 0; i < dataset.length; i++) {
      var key = dataset.at(i)._schema._relAliases.at(0);
      dataStuff[key] = dataset[i];
  }

var dataSA = {};
  var dataCA = {};

  try {
    var queriedSA = executeRelalg(submittedAnswer, dataStuff);

    dataSA = {
      schema: queriedSA.getResult()._schema,
      rows: queriedSA.getResult()._rows
    };

  } catch (error) {
    dataSA = {
      error: error.message
    }
  }

  try {
    var queriedCA = executeRelalg(correctAnswer, dataStuff);

    dataCA = {
      schema: queriedCA.getResult()._schema,
      rows: queriedCA.getResult()._rows
    };

  } catch (error) {
    dataCA = {
      error: error.message
    }
  }


  // Sending a response back to the Python client
  const responseData = {
    queriedSA: dataSA,
    queriedCA: dataCA
    // Replace this example data with actual data based on your processing logic
  };

  res.status(200).json(responseData);
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});