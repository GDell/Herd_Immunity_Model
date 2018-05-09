// Grid variable declarations
var sizeSide = 50; 
var gridSize = sizeSide*sizeSide;

var reference2Darray = []

var percentImmunity;
var numberImmune;
var percentInfected;
var startingNumberSick;


var numberUnvaccinated;

var chanceCatch;
var infectedLog = [];
var immuneLog = [];
var unvaccinatedLog = [] 



function startingSickIndividuals() {
    var arr = []
    while(arr.length < startingNumberSick){
        var randomnumber = Math.floor(Math.random()*gridSize) + 1;
        // console.log('rand numb: '+ randomnumber)
        if(arr.includes(randomnumber)) continue;
        if(immuneLog.includes(randomnumber)) continue;
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
        if(unvaccinatedLog.includes(randomnumber)) continue;
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



function classifyHealth(index, sickList, immuneList, unvaccinatedList) {
  var result = sickList.includes(index);
  var isImmune = immuneList.includes(index);
  var isUnvaccinated = unvaccinatedList.includes(index)

  var type; 
  if(result) {
    // Sickly Green
    type = "infected"
  } else if (isUnvaccinated){
    // Healthy blue
    type = "unvaccinated"
  } else if(isImmune) {

    type = "vaccinated"
  }

  

  return(type)

}



  // FUNCTION: generateScene
  // INPUT: array, imageSRC, sceneName
  // OUTPUT: A scene with an image in all of the img id's specified in the 
// input array.
function generateScene(referenceArray, infectedIndex, immuneIndex, unvaccinatedIndex) {
  var html = '';

  var count = 1;

  for(var i =0; i < sizeSide; i++) { 

    html += '<div class="row" >';
    for(var h=0; h<sizeSide; h++) { 
     
       var imgresult = classifyHealth(count, infectedIndex, immuneIndex, unvaccinatedIndex)

       // console.log(imgresult)
       html += '<div class="square"style="width:10px;height: 10px;">'+ '<div class=" innerSquare  '+ imgresult+'"  style="width:10px;height: 10px;"> '+"&nbsp"+'</div>' + '</div>';
      count = count + 1;
    } 
      html += '</div>'; 
  }
  count = 1;

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




  percentInfected = prompt("Percentage of population introducing infection: ", "Enter a number 0 - 100")

  percentInfected = percentInfected / 100.00
  // percentInfected = .01
  percentImmunity = prompt("Percent vaccinated: ", "Enter a number 0 - 100")

  percentImmunity = percentImmunity /100.00

  chanceCatch = .1




  startingNumberSick  = Math.round(percentInfected * gridSize)
  if(startingNumberSick == 0) {
    startingNumberSick = 1
  }

  numberImmune = Math.round(percentImmunity * gridSize)
  numberUnvaccinated = gridSize - numberImmune - startingNumberSick

  infectedLog = startingSickIndividuals()
  // console.log("infected: "+ infectedLog)
  immuneLog = determineImmuneIndividuals()
  // console.log("immune: "+ immuneLog)
  unvaccinatedLog = determineUnvaccinatedIndividuals()
  //

  count = 1;
  for(var i = 0; i < sizeSide; i++) {
    reference2Darray.push(_.range(count, count+sizeSide))
    // console.log(index)
    count = count + sizeSide
  }

  
  console.log(findingNeighbors(reference2Darray, 10, 10))
  

  var currentScene = generateScene(reference2Darray, infectedLog, immuneLog, unvaccinatedLog);

  document.getElementById('gridHolder').innerHTML = currentScene;

}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}


function findAtRisk() {
  var listOfExposed = [];
  for(var p = 0; p < infectedLog.length; p++) {
    temp = findingNeighbors(reference2Darray,Math.floor(infectedLog[p]/sizeSide)-1,(infectedLog[p]%sizeSide)-1)
    listOfExposed = listOfExposed.concat(temp)
  }

  return listOfExposed;
}


function determineIfInfected(riskList) {
    for(var j = 0; j < riskList.length; j++) {
      if(unvaccinatedLog.includes(riskList[j])){
        infectedLog.push(riskList[j])
        unvaccinatedLog = remove_item(unvaccinatedLog, riskList[j])
      }
    }
}

remove_item = function (arr, value) {
    var b = '';
    for (b in arr) {
        if (arr[b] === value) {
            arr.splice(b, 1);
            break;
        }
    }
    return arr;
}


function draw() {

  // returnArrayOfNeighbors()

  atRiskIndividuals = findAtRisk()

  determineIfInfected(atRiskIndividuals)

    amountInfected = infectedLog.length/gridSize

    document.getElementById('displayInfectedRatio').innerHTML = amountInfected * 100 + " %"
    document.getElementById('displayVaccinationRatio').innerHTML =  percentImmunity * 100 + " % "
    document.getElementById('displayStartingInfectionRatio').innerHTML =  percentInfected * 100 + " % "

 
  
  currentScene = generateScene(reference2Darray, infectedLog, immuneLog, unvaccinatedLog)
  sleep(60);
  document.getElementById('gridHolder').innerHTML = currentScene;


}
