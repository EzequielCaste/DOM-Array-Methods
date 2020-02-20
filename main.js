const listNames = document.querySelector("#list-names");

// What does the app do?
// - shows a list a names and their wealth
// - user name is received from API
// - wealth is calculated with Random function

let mainListArray = [];
let nodesArray = [];
let idCounter = 0;
getUserNames(3);



function getRandomWealth() {
  let wealth = (Math.random() * 999999)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  return wealth;
}

function getUserNames(num = 1) {
  
  let url = "https://randomuser.me/api/?inc=name&results=" + num;

  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      myJson.results.forEach(person => {
        createNode(person);
      });
      totalDiv.setAttribute("style","visibility:hidden")
      //startingPoint();
    });
}

function append(parent, el) {
  return parent.appendChild(el);
}
function setIdToNode(el, counter) {
  return el.setAttribute("id", "row" + counter);
}
function setInnerHTML(el, text) {
  return (el.innerHTML = text);
}
function createNode(person) {
  let name = person.name.first + " " + person.name.last;
  let wealth = getRandomWealth();
  let newLi = document.createElement("li");
  let text = `${name} <span id="right">$ ${wealth.replace(/\d(?=(\d{3})+\.)/g,"$&,")}`;
  setInnerHTML(newLi, text);
  setIdToNode(newLi, idCounter);
  append(listNames, newLi);

  nodesArray.push({
    name: name,
    wealth: wealth,
    id: idCounter
  });
  idCounter++;
}

// Add User Button
// - adds 1 new user to the list
const addUserBtn = document.querySelector("#add");
addUserBtn.addEventListener("click", () => getUserNames());

// Double Money Button
// - multiplies the wealth of every user by 2
const doubleBtn = document.querySelector("#double");
doubleBtn.addEventListener("click", doubleWealth);

function doubleWealth() {
  nodesArray.map(item => {
    //number format
    let newValue = item.wealth.replace("$", "").replace(/,/g, "") * 2;
    //string format
    item.wealth = newValue.toString().replace(/\d(?=(\d{3})+\.)/g, "$&,");
  });
  updateList();
}

function updateList() {
  totalDiv.setAttribute("style","visibility:hidden")
  // get number of list items
  let listItems = listNames.childElementCount;

  for (let i = 0; i < listItems; i++) {
    let el = listNames.firstChild;
    listNames.removeChild(el);
  }

  idCounter = 0;

  nodesArray.forEach(item => {
    let newLi = document.createElement("li");
    let text = `${item.name} <span id="right">$ ${item.wealth.replace(
      /\d(?=(\d{3})+\.)/g,
      "$&,"
    )}`;

    setInnerHTML(newLi, text);
    setIdToNode(newLi, idCounter);
    append(listNames, newLi);
    idCounter++;
  });
}

// Show Millionaires Button
// - only display those users whose wealth is greather than 1,000,000
// (in other words: remove those users with less than 1,000,000 wealth)
const millionBtn = document.querySelector("#millions");
millionBtn.addEventListener("click", showMillions);

function showMillions() {
  let removeArray = [];

  nodesArray.forEach(item => {
    let wealth = Number(item.wealth.replace("$", "").replace(/,/g, ""));

    wealth < 1000000 ? removeArray.push(item) : null;
  });

  removeNode(removeArray);
}
function removeNode(arr) {
  //remove from nodesArray
  arr.forEach(item => {
    let pos = nodesArray.indexOf(item);
    nodesArray.splice(pos, 1);
    idCounter--;
    //remove from dom
    document.querySelector("#row" + item.id).remove();
  });

  updateList();
}

// Sort by Richest Button
// - sort the list by highest wealth
const sortBtn = document.querySelector("#sort");
sortBtn.addEventListener("click", sortByWealth);

function sortByWealth() {
  
  var swapped;
  do {
    swapped = false;
    for (var i = 0; i < nodesArray.length - 1; i++) {
      if (nodesArray[i].wealth < nodesArray[i + 1].wealth) {
        var temp = nodesArray[i];
        nodesArray[i] = nodesArray[i + 1];
        nodesArray[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  updateList()
}

//Calculate entire Wealth
const calculateWealthBtn = document.querySelector("#calculate");
calculateWealthBtn.addEventListener("click", calculateWealth);

const totalDiv = document.querySelector("#total")
totalDiv.setAttribute("style","visibility:hidden")

const wealthTotal = document.querySelector("#totalWealth")


function calculateWealth(){
  let total =0;

  nodesArray.forEach(item=>{
    total = total + Number(item.wealth.replace(/,/g, ""))
  })
  totalDiv.setAttribute("style","visibility:visible")
  wealthTotal.innerText = '$ '+ total.toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g,"$&,")
}


