// Working code

const fs = require("fs");
const { config } = require("process");
const prompt = require('prompt-sync')();


var nameOfNewChannel = "";
var newLoanOptionIds = "";
var addMoreLoanOptions = ""
var newLoanOptionIdsArray = []
var searchRate = ""
var searchTerm = ""

var runAddNewChannel = true
var runAddLoanOptions = true

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

//Asking for name of channel to be created
nameOfNewChannel = prompt('Name of new channel?');

// Loop for adding new channel. Asking user to filter loan options
while(runAddNewChannel){
  searchRate = prompt('Rate? ');
  searchTerm = prompt('Term? ');
  // Output of filtered loan options
  console.log("---------------- FILTERED OPTIONS ------------------ " );
  for(var i=0; i < config.loanOptions.length; i++){
    if(config.loanOptions[i].rate === searchRate && config.loanOptions[i].term === searchTerm){
      console.log("\n" + "id: " + config.loanOptions[i].id + "\n"
      + "productCode: " + config.loanOptions[i].productCode + "\n"
      + "rate: " + config.loanOptions[i].rate + "\n"
      + "term: " + config.loanOptions[i].term + "\n"
      + "---------------------------------");
    }
  }
  newLoanOptionIds = prompt("New loan option ids? ")

  //Adding new channel with loan option(s). Bracket notation must be used in order to use a variable

      newLoanOptionIdsArray.push(newLoanOptionIds)
      config.loanOptionsMap[nameOfNewChannel] = newLoanOptionIdsArray

      addMoreLoanOptions = prompt(`Would you like to add more loan Options to ${nameOfNewChannel}?(y or n)`)
      if (addMoreLoanOptions === "n"){
        runAddNewChannel = false
      } else {
        runAddNewChannel = true
      }
}

  
      // stringifying our json object so we can write to a new file
      fs.writeFile("./newProposedConfig.json", JSON.stringify(config), err => {
      if (err) console.log("Error writing file:", err);
    });
});
