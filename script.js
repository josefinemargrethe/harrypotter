"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
let currentList = [];
let sortButton;
let studentHouse;
let Filter;

function start() {
  console.log("ready");

  //   document.querySelector(".sortingnav").addEventListener("change", selectSorting);
  // TODO: Add event-listeners for filter-buttons

  document.querySelector(".students").addEventListener("click", clickSomething);

  document.querySelectorAll(".sort").forEach(elm => {
    elm.addEventListener("click", setSort);
  });

  document.querySelectorAll(".filter").forEach(elm => {
    elm.addEventListener("click", setFilter);
  });

  loadJSON();
}

function clickSomething(event) {
  let element = event.target;
  const id = element.dataset.id;

  let indexCur = findByIdCur(id);
  let indexAll = findByIdAll(id);

  if (element.dataset.action === "remove") {
    console.log("Remove button clicked");
    element.parentElement.remove();
    currentList.splice(indexCur, 1);
    allStudents.splice(indexAll, 1);
  }

  console.table(currentList);
}

function findByIdCur(id) {
  return currentList.findIndex(obj => obj.id == id);
}
function findByIdAll(id) {
  return allStudents.findIndex(obj => obj.id == id);
}

// function selectSorting(event) {
//   const sortBy = event.target.value;
//   sortListBy(sortBy);
//   displayList(currentList);
// }

function loadJSON() {
  fetch("http://petlatkea.dk/2019/hogwartsdata/students.json")
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    // Create new object with cleaned data
    const student = Object.create(Student);

    const fullName = jsonObject.fullname.trim().split(" ");
    console.log(fullName);
    const house = jsonObject.house.trim();

    student.gender = jsonObject.gender;

    student.house = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();

    student.firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1).toLowerCase();

    if (fullName.length === 2) {
      console.log("studerende har intet mellemnavn");
      student.lastName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1).toLowerCase();
    } else if (fullName.length === 3) {
      console.log("studerende har et mellemnavn");
      student.middleName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1).toLowerCase();
      student.lastName = fullName[2].charAt(0).toUpperCase() + fullName[2].slice(1).toLowerCase();
    }

    student.id = uuidv4();

    allStudents.push(student);
  });

  rebuildList();
}

//UUID generator from: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function rebuildList() {
  filterListBy("all");
  displayList(currentList);
}

function setSort() {
  sortButton = this.getAttribute("data-sort");
  document.querySelectorAll(".sort").forEach(elm => {
    elm.classList.remove("valgt");
  });
  this.classList.add("valgt");
  sortCurrentStudents(sortButton);
}

function sortCurrentStudents(sortButton) {
  // TODO: Sort the list that is received, before displaying it
  currentList.sort((a, b) => {
    let comp;
    if (sortButton == "first_name") {
      comp = a.firstName.localeCompare(b.firstName);
    } else if (sortButton == "last_name") {
      comp = a.lastName.localeCompare(b.lastName);
    } else if (sortButton == "house") {
      comp = a.house.localeCompare(b.house);
    }
    return comp;
  });

  displayList(currentList);
}

// function sortListBy(prop) {
//   currentList.sort((a, b) => (a[prop] > b[prop] ? 1 : -1)); // Don't copy this sorting function, it sucks ...
// }

function filterListBy(filterBy) {
  currentList = allStudents.filter(student => {
    return true; // right now, just don't filter anything
  });
}

function setFilter() {
  Filter = this.dataset.hus;
  document.querySelectorAll(".filter").forEach(elm => {
    elm.classList.remove("valgt");
  });
  this.classList.add("valgt");
  console.log(Filter);
  currentList = filtering(Filter);
  displayList(currentList);
}

function filtering(house) {
  let filterlist = allStudents.filter(filterHouse);
  function filterHouse(student) {
    if (student.house == house || house == "alle") {
      return true;
    } else {
      return false;
    }
  }
  return filterlist;
}

function displayList(students) {
  // clear the list
  document.querySelector(".students").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template").content.cloneNode(true);

  // set clone data
  clone.querySelector(".studentname").innerHTML = `${student.firstName} ${student.middleName} ${student.lastName}`;
  //   clone.querySelector(".studentname").innerHTML += student.middleName;
  //   clone.querySelector(".studentname").innerHTML += student.lastName;
  clone.querySelector(".house").innerHTML = student.house;
  //   clone.querySelector("[data-field=type]").textContent = animal.type;
  //   clone.querySelector("[data-field=age]").textContent = animal.age;

  //store the index on the button
  clone.querySelector("[data-action=remove]").dataset.id = student.id;

  // append clone to list
  document.querySelector(".students").appendChild(clone);

  document.querySelector(".students").lastElementChild.addEventListener("click", () => {
    visSingle(student);

    function visSingle(student) {
      document.querySelector("#indhold").innerHTML = `
                <article class="singlestudent">
                    <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
                    <p>${student.house}.</p>
                </article>
                   `;
      document.querySelector("#popup").style.display = "block";
      document.querySelector("#popup #luk").addEventListener("click", close);
      stylePopop();
    }

    function close() {
      document.querySelector("#popup").style.display = "none";
    }

    studentHouse = `${student.house}`;
    stylePopop();
  });

  function stylePopop() {
    const Gryffindor = "#4c0405";
    const Hufflepuff = "#f3de07";
    const Ravenclaw = "#0b304a";
    const Slytherin = "#234723";

    if (studentHouse == "Gryffindor") {
      document.querySelector("#popup").style.backgroundColor = Gryffindor;
    } else if (studentHouse == "Hufflepuff") {
      document.querySelector("#popup").style.backgroundColor = Hufflepuff;
    } else if (studentHouse == "Ravenclaw") {
      document.querySelector("#popup").style.backgroundColor = Ravenclaw;
    } else if (studentHouse == "Slytherin") {
      document.querySelector("#popup").style.backgroundColor = Slytherin;
    }
  }
}

// Our prototype Student
const Student = {
  firstName: "-firstName-",
  middleName: "",
  lastName: "",
  gender: "-gender-",
  house: "-house-",
  id: "-id"
};
