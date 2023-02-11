// Working code

const fs = require("fs");
const { config } = require("process");
const prompt = require('prompt-sync')();


var nameOfNewChannel = "";
var newLoanOptionIds = "";
var addMoreLoanOptions = ""
var newLoanOptionIdsArray = []
var matchingLoanOptions= []
var reorganizedChannelArr = []
var searchRate = ""
var searchTerm = ""
var mainMenuOption = ""

var runApp = true
var runAddNewChannel = false
var runAddToExistingChannel = false
var addNewLoanOptionIdsExisting = false
var pushNewLoanOptionsExisting = false
var runFilter = false
var runFilterExisting = false
var addNewLoanOptionIds = false
var runAddLoanOptions = false
var pushNewLoanOptions = false
var runMainMenu = true
var runReorganizeChannel = false

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

  while(runApp){
    // Main Menu

while(runMainMenu){
  console.log(("1: Create new channel and add new loan options to it" + "\n" + 
  "2: Add Loan Options to existing channel" + "\n" +
  "3: Remove Loan Options from existing channel" + "\n" +
  "4: Reorganize channel" + "\n" +
  "5: Delete channel and archive loan options within them" + "\n" +
  "6: Save config file" + "\n"));
  mainMenuOption = prompt("Your input >> ") 
  
  
  // Main Menu controller
  if(mainMenuOption == "1"){
    runMainMenu = false
    //Asking for name of channel to be created
    nameOfNewChannel = prompt('Name of new channel?');
    runAddNewChannel = true
  } else if(mainMenuOption == "2"){
    runMainMenu = false
    runAddToExistingChannel = true
  }else if(mainMenuOption == "4"){
    runMainMenu = false
    runReorganizeChannel = true
  } else if(mainMenuOption == "6"){
    runMainMenu = false
    runApp = false
  }
  
  
  }
  
  
  // Loop for ADDING NEW CHANNEL. Asking user to filter loan options
    while(runAddNewChannel){
      runFilter = true
    //Running filter
    while(runFilter){
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
    runFilter = false
    addNewLoanOptionIds = true
    }
  
    while(addNewLoanOptionIds){
      newLoanOptionIds = prompt("New loan option ids? (press q to go back to filter loan options, m to go back to main menu) ")
  
      if(newLoanOptionIds == "q"){
        addNewLoanOptionIds = false
        runFilter = true
      } else if(newLoanOptionIds == "m"){
        runAddNewChannel = false
        addNewLoanOptionIds = false
        runFilter = false
        runMainMenu = true
      } else {
        addNewLoanOptionIds = false
        pushNewLoanOptions = true
        runFilter = false     
      }
    }
  
    while(pushNewLoanOptions){
        //Adding new channel with loan option(s). Bracket notation must be used in order to use a variable
    
      newLoanOptionIdsArray.push(newLoanOptionIds)
      config.loanOptionsMap[nameOfNewChannel] = newLoanOptionIdsArray
  
      console.log(`Pushed ${newLoanOptionIds} to ${nameOfNewChannel}`);
    
      addMoreLoanOptions = prompt(`Would you like to add more loan Options to ${nameOfNewChannel}?(y or n)`)
      if (addMoreLoanOptions === "n"){
        addNewLoanOptionIds = false
        runAddNewChannel = false
        pushNewLoanOptions = false
        runMainMenu = true
      } else {
        pushNewLoanOptions = false
        addNewLoanOptionIds = true
      }
    } 
  }
  
  


  /////////////////// Loop for ADDING TO EXISTING CHANNEL/////////////
  while(runAddToExistingChannel){
    // Grabbing names of existing channels and storing them in an array
    var existingChannels = Object.keys(config.loanOptionsMap)
    // looping through channel names and displaying them for user
    for(i = 0; i < existingChannels.length; i++){
      console.log(`${i + 1}: ${existingChannels[i]}`);
    }
    // asking user for channel name selection
    var selectedExistingChannel = prompt("Which channel would you like to add to? (specify number)")
    var nameSelectedExistingChannel = existingChannels[selectedExistingChannel - 1]
    console.log(config.loanOptionsMap[nameSelectedExistingChannel]);
    runFilterExisting = true
  
    //Filter loan options
    while(runFilterExisting){
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
    runFilterExisting = false
    addNewLoanOptionIdsExisting = true
    }
  
    //Choose loan option to add
  
    while(addNewLoanOptionIdsExisting){
      newLoanOptionIds = prompt("New loan option ids? (press q to go back to filter loan options, m to go back to main menu) ")
  
      if(newLoanOptionIds == "q"){
        addNewLoanOptionIdsExisting = false
        runFilterExisting = true
      }else if(newLoanOptionIds == "m"){
        runAddToExistingChannel = false
        addNewLoanOptionIdsExisting = false
        runFilterExisting = false
        runMainMenu = true
      } else{
        addNewLoanOptionIdsExisting = false
        pushNewLoanOptionsExisting = true
        runFilterExisting = false     
      }
    }
  
    //Add loan option to specified existing channel
  
    while(pushNewLoanOptionsExisting){
      //Adding new channel with loan option(s). Bracket notation must be used in order to use a variable
  
  
    config.loanOptionsMap[nameSelectedExistingChannel].push(newLoanOptionIds)
    console.log(config.loanOptionsMap[nameSelectedExistingChannel]);
  
    console.log(`Pushed ${newLoanOptionIds} to ${nameSelectedExistingChannel}`);
  
    //Ask if want to add another loan option to the existing channel
  
    addMoreLoanOptions = prompt(`Would you like to add more loan Options to ${nameSelectedExistingChannel}?(y or n)`)
    if (addMoreLoanOptions === "n"){
      pushNewLoanOptionsExisting = false
      addNewLoanOptionIdsExisting = false
      runAddToExistingChannel = false
      runFilterExisting = false
      runMainMenu = true
    } else {
      pushNewLoanOptionsExisting = false
      addNewLoanOptionIdsExisting = true
    }
  } 
  }

//////////////  REORGANIZE CHANNEL ////////////////////

while(runReorganizeChannel){
  // Grabbing names of existing channels and storing them in an array
  var existingChannels = Object.keys(config.loanOptionsMap)
  // looping through channel names and displaying them for user
  for(i = 0; i < existingChannels.length; i++){
    console.log(`${i + 1}: ${existingChannels[i]}`);
  }
  // asking user for channel name selection
  var selectedExistingChannel = prompt("Which channel would you like to reorganize? (specify number)")
  var nameSelectedExistingChannel = existingChannels[selectedExistingChannel - 1]
  console.log(config.loanOptionsMap[nameSelectedExistingChannel]);
  runReorganizeChannel = false
  runChannelReorganizationAction = true
  }

  // Reorganization of the selected channel
  while(runChannelReorganizationAction){
    // storing matching loan option objects into an array
    for(let i = 0; i < config.loanOptionsMap[nameSelectedExistingChannel].length; i++){
        var result = config.loanOptions.filter(obj => {
          return obj.id == config.loanOptionsMap[nameSelectedExistingChannel][i]
        }) 
        matchingLoanOptions.push(result)   
    }
    // sorting array of matching loan option objects by term and rate
    matchingLoanOptions.sort((a,b)=>(a[0].term-b[0].term || a[0].rate-b[0].rate));
    // 
    console.log("Sorted");
    // pushing reorganized ids into a new array and setting the array to the selected channel
    for(let b = 0; b < matchingLoanOptions.length; b++){
      reorganizedChannelArr.push(matchingLoanOptions[b][0].id);
    }
    // Resetting arrays for next use and logging results for user
    matchingLoanOptions = []
    config.loanOptionsMap[nameSelectedExistingChannel] = reorganizedChannelArr
    console.log(config.loanOptionsMap[nameSelectedExistingChannel])
    reorganizedChannelArr = []
    // setting run variables to false/true to return to main menu
    runChannelReorganizationAction = false
    runReorganizeChannel = false
    runMainMenu = true
  }
}







  
/////////////////WRITING TO NEW JSON FILE WHEN DONE//////////////////////

      // stringifying our json object so we can write to a new file
      fs.writeFile("./newProposedConfig.json", JSON.stringify(config), err => {
      if (err) console.log("Error writing file:", err);
    });
    console.log("New proposed config written");

});
