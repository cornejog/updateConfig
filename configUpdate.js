// Working code

const fs = require("fs");
const { config } = require("process");
const prompt = require('prompt-sync')();

var nameOfNewChannel = "";
var newLoanOptionIds = [];

//function to read in our json file and parse it
function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

// Calling our json file function
jsonReader("./testClientConfig.json", (err, config) => {
  if (err) {
    console.log(err);
    return;
  }

  nameOfNewChannel = prompt('Name of new channel?');
  newLoanOptionIds = prompt("New loan option ids?")

  //Adding new channel with loan option(s). Bracket notation must be used in order to use a variable


      // nameOfNewChannel = 'nono'
      newLoanOptionIdsArray = [newLoanOptionIds]
      config.loanOptionsMap[nameOfNewChannel] = newLoanOptionIdsArray
      // stringifying our json object so we can write to a new file
      fs.writeFile("./newProposedConfig.json", JSON.stringify(config), err => {
      if (err) console.log("Error writing file:", err);
    });
});
