// Working code

const fs = require("fs");
const { config } = require("process");
const prompt = require('prompt-sync')();
const testFolder = 'C:/Users/gcornejo/Desktop/updateConfig/updateConfig'

// variables for storing data
var filesArray = []
var fileCounter = 0
var nameOfNewChannel = "";
var newLoanOptionIds = "";
var removeOptionIds = ""
var addMoreLoanOptions = ""
var newLoanOptionIdsArray = []
var matchingLoanOptions= []
var reorganizedChannelArr = []
var searchRate = ""
var searchTerm = ""
var mainMenuOption = ""
var selectedExistingChannel = ""
var savedProgramFee = ""


// while loop variables
var runApp = true
var runAddNewChannel = false
var runPromptNewChannelName = false
var runAddMoreLoanOptionsToNewChannel = false
var runAddToExistingChannel = false
var runSelectExistingChannel = false
var runAddMoreLoanOptionsToExistingChannel = false
var runRemoveFromExistingChannel = false
var runSelectExistingChannelRemoveFrom = false
var removeOptionIdsExisting = false
var runRemoveMoreLoanOptionsFromExistingChannel = false
var selectedLoanOptionsExisting = false
var addNewLoanOptionIdsExisting = false
var pushNewLoanOptionsExisting = false
var runFilter = false
var runFilterExisting = false
var runFilterExistingRemove = false
var addNewLoanOptionIds = false
var runAddLoanOptions = false
var pushNewLoanOptions = false
var runMainMenu = true
var runReorganizeChannel = false
var runChannelReorganizationAction = false
var runSaveConfigFile = false
var runRemoveProgramFees = false

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

fs.readdirSync(testFolder).forEach(file => {
  console.log(fileCounter + " : " + file);
  filesArray.push(file)
  fileCounter++
});

var fileSelection = prompt("Which JSON File would you like to use?")
console.log(filesArray[fileSelection] + "\n" + "\n");

// Calling our json file function
jsonReader(`./${filesArray[fileSelection]}`, (err, config) => {
  if (err) {
    console.log(err);
    return;
  }

  while(runApp){


    // Main Menu

while(runMainMenu){
  console.log(("0: Exit program" + "\n" + 
  "1: Create new channel and add new loan options to it" + "\n" +
  "2: Add Loan Options to existing channel" + "\n" +
  "3: Remove Loan Options from existing channel" + "\n" +
  "4: Reorganize channel" + "\n" +
  "5: Delete channel and archive loan options within them" + "\n" +
  "6: Remove program fees for specific approved at date" + "\n" +
  "7: Save config file" + "\n" ));
  mainMenuOption = prompt("Your input >> ") 
  
  
  // Main Menu controller
  if(mainMenuOption == "0"){
    runMainMenu = false
    runApp = false
  }
   else if(mainMenuOption == "1"){
    runMainMenu = false
    //Asking for name of channel to be created
      runAddNewChannel = true
      runPromptNewChannelName = true
  } else if(mainMenuOption == "2"){
    runMainMenu = false
    runSelectExistingChannel = true
    runAddToExistingChannel = true
  }else if(mainMenuOption == "3"){
    runMainMenu = false
    runSelectExistingChannelRemoveFrom = true
    runRemoveFromExistingChannel = true
  }else if(mainMenuOption == "4"){
    runMainMenu = false
    runReorganizeChannel = true
  } else if(mainMenuOption == "5"){
    console.log("\n" + "Coming soon!!!!" + "\n");
  } else if(mainMenuOption == "6"){
    runMainMenu = false
    runRemoveProgramFees = true
  } else if(mainMenuOption == "7"){
    runMainMenu = false
    runApp = false
    runSaveConfigFile = true
  } 
  
  
  }
  
  
  ////////////////////////////////////// Loop for ADDING NEW CHANNEL. Asking user to filter loan options ///////////////////////////////////
    while(runAddNewChannel){

      while(runPromptNewChannelName){
        nameOfNewChannel = prompt('Name of new channel?');
      if(nameOfNewChannel !== "" && nameOfNewChannel != null){
        runFilter = true
        runPromptNewChannelName = false
      } else {
        console.log("Please enter a name for the new channel. Can't be blank");
      }
      }
           
    //Running filter
    while(runFilter){
    searchRate = prompt('Rate? ');
    searchTerm = prompt('Term? ');
    // Output of filtered loan options
    console.log("---------------- FILTERED OPTIONS ------------------ " );
    for(var i=0; i < config.loanOptions.length; i++){
      if(config.loanOptions[i].rate === searchRate && config.loanOptions[i].term === searchTerm){
        if(config.loanOptions[i].isSub650 == undefined){
            console.log("\n" + "id: " + config.loanOptions[i].id + "\n"
            + "productCode: " + config.loanOptions[i].productCode + "\n"
            + "categoryCode: " + config.loanOptions[i].categoryCode + "\n"
            + "rate: " + config.loanOptions[i].rate + "\n"
            + "term: " + config.loanOptions[i].term + "\n"
            + "isArchived: " + config.loanOptions[i].isArchived + "\n"
            + "isSub650: " + config.loanOptions[i].isSub650 + "\n"
            + "---------------------------------");
        }
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
        newLoanOptionIdsArray = []
        runMainMenu = true
      } else if(isNaN(newLoanOptionIds) || newLoanOptionIds === "" || newLoanOptionIds == null){
        console.log("wrong Input");
        addNewLoanOptionIds = true
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

      for(var i=0; i < config.loanOptions.length; i++){
        if(config.loanOptions[i].id == newLoanOptionIds){
          if(config.loanOptions[i].isArchived == true){
            config.loanOptions[i].isArchived = false
            console.log(`Unarchived loan option ${config.loanOptions[i].id}`)
          }
        }
      }

      console.log(`${nameOfNewChannel}`) 
      console.log(config.loanOptionsMap[nameOfNewChannel])
      runAddMoreLoanOptionsToNewChannel = true

      while(runAddMoreLoanOptionsToNewChannel){
        addMoreLoanOptions = prompt(`Would you like to add more loan Options to ${nameOfNewChannel}?(y or n)`)
        if (addMoreLoanOptions === "n"){
          addNewLoanOptionIds = false
          runAddNewChannel = false
          pushNewLoanOptions = false
          runMainMenu = true
          newLoanOptionIdsArray = []
          runAddMoreLoanOptionsToNewChannel = false
        } else if(addMoreLoanOptions === "y"){
          pushNewLoanOptions = false
          runFilter = true
          addNewLoanOptionIds = false
          runAddMoreLoanOptionsToNewChannel = false
        } else {
          console.log("Wrong input. Please enter y or n");
        }
      }
      
    } 
  }
  
  


  /////////////////// Loop for ADDING TO EXISTING CHANNEL/////////////
  while(runAddToExistingChannel){
    
    while(runSelectExistingChannel){
      // Grabbing names of existing channels and storing them in an array
    var existingChannels = Object.keys(config.loanOptionsMap)
    // looping through channel names and displaying them for user
    for(i = 0; i < existingChannels.length; i++){
      console.log(`${i + 1}: ${existingChannels[i]}`);
    }
    // asking user for channel name selection
     selectedExistingChannel = prompt("Which channel would you like to add to? (specify number)")
    var nameSelectedExistingChannel = existingChannels[selectedExistingChannel - 1]
    if(selectedExistingChannel > existingChannels.length || isNaN(selectedExistingChannel) || selectedExistingChannel === "" || nameSelectedExistingChannel == null){
      console.log("Wrong Input. Please specify the correct number");
    } else {
      console.log(config.loanOptionsMap[nameSelectedExistingChannel]);
      runFilterExisting = true
      runSelectExistingChannel = false
    }
    
    }
  
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
        + "categoryCode: " + config.loanOptions[i].categoryCode + "\n"
        + "rate: " + config.loanOptions[i].rate + "\n"
        + "term: " + config.loanOptions[i].term + "\n"
        + "isArchived: " + config.loanOptions[i].isArchived + "\n"
        + "isSub650: " + config.loanOptions[i].isSub650 + "\n"
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
      } else if(isNaN(newLoanOptionIds) || newLoanOptionIds === "" || newLoanOptionIds == null){
        console.log("Wrong input. Please enter a loan option ID number, q or m");
        addNewLoanOptionIds = true
      }  else{
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
    for(var i=0; i < config.loanOptions.length; i++){
      if(config.loanOptions[i].id == newLoanOptionIds){
        if(config.loanOptions[i].isArchived == true){
          config.loanOptions[i].isArchived = false
          console.log(`Unarchived loan option ${config.loanOptions[i].id}`)
        }
      }
    }
    runAddMoreLoanOptionsToExistingChannel = true


    //Ask if want to add another loan option to the existing channel
    while(runAddMoreLoanOptionsToExistingChannel){
      addMoreLoanOptions = prompt(`Would you like to add more loan Options to ${nameSelectedExistingChannel}?(y or n)`)
    if (addMoreLoanOptions === "n"){
      pushNewLoanOptionsExisting = false
      addNewLoanOptionIdsExisting = false
      runAddToExistingChannel = false
      runFilterExisting = false
      runMainMenu = true
      runAddMoreLoanOptionsToExistingChannel = false
    } else if(addMoreLoanOptions == "y") {
      pushNewLoanOptionsExisting = false
      runFilterExisting = true
      addNewLoanOptionIdsExisting = false
      runAddMoreLoanOptionsToExistingChannel = false
    } else {
      console.log("Wrong input. Please enter y or n");
    }
    }
    
  } 
}






  ///////////////////// REMOVE FROM EXISTING CHANNEL ////////////////////////////////
  
  while(runRemoveFromExistingChannel){

    while(runSelectExistingChannelRemoveFrom){
      // Grabbing names of existing channels and storing them in an array
    var existingChannels = Object.keys(config.loanOptionsMap)
    // looping through channel names and displaying them for user
    for(i = 0; i < existingChannels.length; i++){
      console.log(`${i + 1}: ${existingChannels[i]}`);
    }
    // asking user for channel name selection
    selectedExistingChannel = prompt("Which channel would you like to remove from? (specify number)")
    var nameSelectedExistingChannel = existingChannels[selectedExistingChannel - 1]
    if(selectedExistingChannel > existingChannels.length || isNaN(selectedExistingChannel) || selectedExistingChannel === "" || selectedExistingChannel == null){
      console.log("Wrong Input. Please specify the correct number");
    } else {
      console.log(config.loanOptionsMap[nameSelectedExistingChannel]);
      runFilterExistingRemove = true
      runSelectExistingChannelRemoveFrom = false
    }
    
    }
    
  
    //Filter loan options
    while(runFilterExistingRemove){
    searchRate = prompt('Rate? ');
    searchTerm = prompt('Term? ');
    // Output of filtered loan options
    console.log("---------------- FILTERED OPTIONS ------------------ " );
    for(var i=0; i < config.loanOptions.length; i++){
      if(config.loanOptions[i].rate === searchRate && config.loanOptions[i].term === searchTerm){
        console.log("\n" + "id: " + config.loanOptions[i].id + "\n"
        + "productCode: " + config.loanOptions[i].productCode + "\n"
        + "categoryCode: " + config.loanOptions[i].categoryCode + "\n"
        + "rate: " + config.loanOptions[i].rate + "\n"
        + "term: " + config.loanOptions[i].term + "\n"
        + "isArchived: " + config.loanOptions[i].isArchived + "\n"
        + "isSub650: " + config.loanOptions[i].isSub650 + "\n"
        + "---------------------------------");
      }
    }
    runFilterExistingRemove = false
    removeOptionIdsExisting = true
    }

    while(removeOptionIdsExisting){
      removeOptionIds = prompt("Remove loan option ids? (press q to go back to filter loan options, m to go back to main menu) ")
  
      if(removeOptionIds == "q"){
        removeOptionIdsExisting = false
        runFilterExistingRemove = true
      }else if(removeOptionIds == "m"){
        runRemoveFromExistingChannel = false
        removeOptionIdsExisting = false
        runFilterExistingRemove = false
        runMainMenu = true
      } else if(isNaN(removeOptionIds) || removeOptionIds === "" || removeOptionIds == null){
        console.log("Wrong input. Please enter a loan option ID number, q or m");
      } else{
        removeOptionIdsExisting = false
        selectedLoanOptionsExisting = true
        runFilterExisting = false     
      }
    }
  
    //Remove loan option from specified existing channel
  
    while(selectedLoanOptionsExisting){
      //Removing loan option from existing channel. Bracket notation must be used in order to use a variable
  
    for(let i = 0; i < config.loanOptionsMap[nameSelectedExistingChannel].length; i++){
      if(config.loanOptionsMap[nameSelectedExistingChannel][i] == removeOptionIds){
        config.loanOptionsMap[nameSelectedExistingChannel].splice(i,1)
      }
    }

    console.log(config.loanOptionsMap[nameSelectedExistingChannel]);
  
    console.log(`Removed ${removeOptionIds} from ${nameSelectedExistingChannel}`);

    runRemoveMoreLoanOptionsFromExistingChannel = true
  
    //Ask if want to remove another loan option from the existing channel
    while(runRemoveMoreLoanOptionsFromExistingChannel){
      removeMoreLoanOptions = prompt(`Would you like to remove more loan Options from ${nameSelectedExistingChannel}?(y or n)`)
    if (removeMoreLoanOptions == "n"){
      selectedLoanOptionsExisting = false
      removeOptionIdsExisting = false
      runRemoveFromExistingChannel = false
      runFilterExistingRemove = false
      runMainMenu = true
      runRemoveMoreLoanOptionsFromExistingChannel = false
    } else if(removeMoreLoanOptions == "y"){
      selectedLoanOptionsExisting = false
      runFilterExistingRemove = true
      runRemoveMoreLoanOptionsFromExistingChannel = false
    } else {
      console.log("Wrong input. Please enter y or n");
    }
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
  selectedExistingChannel = prompt("Which channel would you like to reorganize? (specify number)")
  
  if(selectedExistingChannel > existingChannels.length || isNaN(selectedExistingChannel) || selectedExistingChannel === "" || selectedExistingChannel == null){
    console.log("Wrong Input. Please specify the correct number");
  } else {
    var nameSelectedExistingChannel = existingChannels[selectedExistingChannel - 1]
    console.log(config.loanOptionsMap[nameSelectedExistingChannel]);
    runReorganizeChannel = false
    runChannelReorganizationAction = true
  }
  
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

  ///////////////////REMOVAL OF PROGRAM FEES////////////////////


  while(runRemoveProgramFees){

    var specifiedApprovedAtDate = prompt("Which approved at date would you like to remove(yyyy-mm-dd)")
    // loop through program fees and log specific date

    // for(let i = 0; i < config.loanOptions.length; i++){
    //   if(config.loanOptions[i].programFee[1].approvedAt == "2023-03-01"){
    //     console.log(config.loanOptions[i].programFee[1].approvedAt);
    //   }             
    // }

    for(let i = 0; i < config.loanOptions.length; i++){   
      for(let a = 0; a < config.loanOptions[i].programFee.length; a++){
        // console.log(config.loanOptions[i].programFee[a].approvedAt)
        if(config.loanOptions[i].programFee[a].approvedAt == specifiedApprovedAtDate){
          config.loanOptions[i].programFee.splice(a , 1)
        }
      }          
    }
    console.log("Removed requested program fees");
    console.log("Readjusting brackets");

    for(let i = 0; i < config.loanOptions.length; i++){
      for(let a = 0; a < config.loanOptions[i].programFee.length; a++){
        if(config.loanOptions[i].programFee.length == 1){
          savedProgramFee =  config.loanOptions[i].programFee[a].value;
          config.loanOptions[i].programFee.splice(a , 1)
          savedProgramFee =  config.loanOptions[i].programFee = savedProgramFee
          console.log("Bracket Readjusted");
        }        
      }
    }

    console.log("Program Fees Complete");
    runRemoveProgramFees = false
    runMainMenu = true
  }





  /////////////////WRITING TO NEW JSON FILE WHEN DONE//////////////////////

  while(runSaveConfigFile){
    // stringifying our json object so we can write to a new file
    fs.writeFile(`./newProposed${filesArray[fileSelection]}`, JSON.stringify(config), err => {
      if (err) console.log("Error writing file:", err);
    });
    console.log("New proposed config written");
    runSaveConfigFile = false
    runApp = false
  }

      
}

console.log("Goodbye!");

});
