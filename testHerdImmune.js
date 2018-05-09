

// Grid variable declarations
var sizeSide = 50; 
var gridSize = sizeSide*sizeSide;

var reference2Darray = []


var percentImmunity = .50;
var numberImmune = Math.round(percentImmunity * gridSize)
var percentInfected = .50;
var startingNumberSick  = Math.round(percentInfected * gridSize)

var numberUnvaccinated = gridSize - numberImmune - startingNumberSick



var chanceCatch = .50
var infectedLog = [];
var immuneLog = [];
var unvaccinatedLog = [] 



// var arrayOfSquares = []
// arrayOfSquares _.range(1, sizeSide*sizeSide)

function startingSickIndividuals() {

    var arr = []
    while(arr.length < startingNumberSick){
        var randomnumber = Math.floor(Math.random()*gridSize) + 1;
        // console.log('rand numb: '+ randomnumber)
        if(arr.includes(randomnumber)) continue;
        arr[arr.length] = randomnumber;
    }

    return(arr)

}


function determineImmuneIndividuals() {

    var arr = []
    while(arr.length < numberImmune){
        var randomnumber = Math.floor(Math.random()*gridSize) + 1;
        // console.log('rand numb: '+ randomnumber)
        if(arr.includes(randomnumber)) continue;
        if(infectedLog.includes(randomnumber)) continue;
        arr[arr.length] = randomnumber;
    }

    return(arr)

}

function determineUnvaccinatedIndividuals() {

    var arr = []
    while(arr.length < numberUnvaccinated){
        var randomnumber = Math.floor(Math.random()*gridSize) + 1;
        // console.log('rand numb: '+ randomnumber)
        if(arr.includes(randomnumber)) continue;
        if(infectedLog.includes(randomnumber)) continue;
        if(immuneLog.includes(randomnumber)) continue;
        arr[arr.length] = randomnumber;
    }

    return(arr)

}



function sickOrHealthy(index, sickList, immuneList) {
  var result = sickList.includes(index);
  var isImmune = immuneList.includes(index);

  var type; 
  if(result) {
    // Sickly Green
    type = "infected"
  } else {
    // Healthy blue
    type = "unvaccinated"
  }

  if(isImmune) {

    type = "vaccinated"
  }

  

  return(type)

}



  // FUNCTION: generateScene
  // INPUT: array, imageSRC, sceneName
  // OUTPUT: A scene with an image in all of the img id's specified in the 
// input array.
function generateScene(infectedIndex, immuneIndex) {
  var html = '';

  var count = 1;

  for(var i =0; i < sizeSide; i++) { 

    html += '<div class="row" >';
    for(var h=0; h<sizeSide; h++) { 
      // console.log("THIS IS Count :"+ count)
       var imgresult = sickOrHealthy(count, infectedIndex, immuneIndex)
       // console.log(imgresult)
       html += '<div class="square"style="width:10px;height: 10px;">'+ '<div class=" innerSquare  '+ imgresult+'"  style="width:10px;height: 10px;"> '+"&nbsp"+'</div>' + '</div>';
      count = count + 1;
    } 
      html += '</div>'; 
  }
  count = 0;

  // console.log(html)

  return html;
}


function findingNeighbors(myArray, i, j) {

  var tempNeighborArray = []

  var rowLimit = myArray.length-1;
  var columnLimit = myArray[0].length-1;
  for(var x = Math.max(0, i-1); x <= Math.min(i+1, rowLimit); x++) {
    for(var y = Math.max(0, j-1); y <= Math.min(j+1, columnLimit); y++) {
      if(x !== i || y !== j) {
        tempNeighborArray.push(myArray[x][y]);
      }
    }
  }

  return tempNeighborArray;

}



  



function setup() {




  percentInfected = prompt("Percent infected: ", "Enter a decimal 0.0 - 1.0")
  percentImmunity = prompt("Percent vaccinated: ", "Enter a decimal 0.0 - 1.0")
  chanceCatch = prompt("Chance of Transmission: ", "Enter a decimal 0.0 - 1.0")




  startingNumberSick  = Math.round(percentInfected * gridSize)
  numberImmune = Math.round(percentImmunity * gridSize)
  numberUnvaccinated = gridSize - numberImmune - startingNumberSick

  infectedLog = startingSickIndividuals()
  immuneLog = determineImmuneIndividuals()
  unvaccinatedLog = determineUnvaccinatedIndividuals()


  // console.log("unvaccinated: "+ unvaccinatedLog )

  console.log("Number unvaccinated: "+ numberUnvaccinated)
console.log("Number vaccinated: " + numberImmune)

  count = 1;
  for(var i = 0; i < sizeSide*sizeSide; i++) {
    reference2Darray.push(_.range(count, count+10))
    // console.log(index)
    count = count + 10
  }

  
  console.log(reference2Darray)
  // findingNeighbors(reference2Darray, 18, 4)


  var currentScene = generateScene();

  document.getElementById('gridHolder').innerHTML = currentScene;

}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}


function returnArrayOfNeighbors() {
  var infectedNeighbors = []

  for(m = 0; m < infectedLog.length; m++) {
    // console.log("THIS IS M: "+ infectedLog[m])
    thisX = Math.floor(infectedLog[m]/10)-1
    thisY = (infectedLog[m]%10) -1
    tempResult = findingNeighbors(reference2Darray, thisX, thisY)
    // console.log( [thisX, thisY])
    // console.log(tempResult)
    infectedNeighbors.push(tempResult)
  } 

  newInfections = determineNewlyInfected(infectedNeighbors)

  for(var h = 0; h < newInfections.length; h++) {
      infectedLog.push(newInfections[h])
  }
  



}


function determineNewlyInfected(neighborList) {
  var newlyInfected = [];

  for(j = 0; j < neighborList.length; j ++) {
    // console.log("J: " + j)
    for(f = 0; f < neighborList[j].length; f++ ) {
      // console.log("F: " + f)
      tempNum = neighborList[j][f]
      // console.log(tempNum)
      if((!immuneLog.includes(tempNum)) && (!infectedLog.includes(tempNum))) {

          if(Math.random() < chanceCatch) {
            newlyInfected.push(tempNum)
          }
        
      }
    }
  }

  // console.log("The newly infected: " + newlyInfected)

  return newlyInfected;
}




function draw() {

  returnArrayOfNeighbors()

  // var toBecomeInfected = []

  // returnArrayOfNeighbors(infectedLog);
  // for (var i = 0; i < sizeSide; i++) {
  //   for(var k = 0; k < sizeSide; k++) {
  //     // console.log("WE MADE IT " + reference2Darray[i][k])
  //     if(unvaccinatedLog.includes(reference2Darray[i][k])) {

  //       var unvacNeighbors = findingNeighbors(reference2Darray, i, k)
  //       for(var l = 0; l < unvacNeighbors.length; l++) {
  //         if(infectedLog.includes(unvacNeighbors[l])) {
  //           toBecomeInfected.push(reference2Darray[i][k])
  //         }
  //       }
  //     }
  //   } 
  // }  

  //   // console.log(toBecomeInfected)
  sleep(1);
  currentScene = generateScene()
  document.getElementById('gridHolder').innerHTML = currentScene;

  // infectedLog = infectedLog.concat(toBecomeInfected)

  // for(var o = 0; o < toBecomeInfected.length; o++) {
  //     var item = toBecomeInfected[o];
  //     var index = unvaccinatedLog.indexOf(item);
  //     if (index > -1) {
  //       unvaccinatedLog.splice(index, 1);
  //     }
  // }
  
}
