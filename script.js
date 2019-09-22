"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
let currentList = [];
let expelledList = [];
let sortButton;
let studentHouse;
let Filter;
let bloodStatus = [];

const Josefine = {
  firstName: "-firstname-",
  middleName: "",
  lastName: "-lastname-",
  house: "-house-",
  id: "666",
  bloodStatus: "",
  prefect: false
};

function start() {
  console.log("ready");

  document.querySelector(".students").addEventListener("click", clickSomething);

  document.querySelectorAll(".sort").forEach(elm => {
    elm.addEventListener("click", setSort);
  });

  document.querySelectorAll(".filter").forEach(elm => {
    elm.addEventListener("click", setFilter);
  });

  const josefine = Object.create(Josefine);
  josefine.firstName = "Josefine";
  josefine.middleName = "Margrethe";
  josefine.lastName = "Hansen";
  josefine.house = "Hufflepuff";
  josefine.id = uuidv4();
  josefine.bloodStatus = "";
  josefine.imageName = "hansen_j.png";
  josefine.houseImage = "hufflepuff.png";

  allStudents.push(josefine);
  currentList.push(josefine);

  loadJSON();
  loadJSONBlood();
}

function clickSomething(event) {
  let element = event.target;
  const id = element.dataset.id;

  let indexCur = findByIdCur(id);
  let indexAll = findByIdAll(id);
  let clickedStudent = allStudents[indexAll];

  if (element.dataset.action === "remove") {
    console.log("Remove button clicked");
    element.parentElement.remove();
    currentList.splice(indexCur, 1);
    allStudents.splice(indexAll, 1);
    document.querySelector(".studentcount").innerHTML = `Number of students in class: ${currentList.length}`;
  } else if (element.dataset.action === "prefect") {
    clickedStudent.prefect = true;
    addingPrefectEvent(clickedStudent, element);
  }
}

function findByIdCur(id) {
  return currentList.findIndex(obj => obj.id == id);
}
function findByIdAll(id) {
  return allStudents.findIndex(obj => obj.id == id);
}

function loadJSON() {
  fetch("http://petlatkea.dk/2019/hogwartsdata/students.json")
    .then(response => response.json())
    .then(jsonData => {
      // when JSON is loaded, we will clean and prepare the objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    // Create new object with cleaned data from our prototype
    const student = Object.create(Student);

    const fullName = jsonObject.fullname.trim().split(" ");
    console.log(fullName);
    const house = jsonObject.house.trim();

    //Trying to make a variabel for the thing to put in image-source... it is for example 'granger_h'
    const imageName = `"${jsonObject.fullname}.toLowerCase()" + "_" + "${jsonObject.fullname}.charAt(0).toLowerCase" + "${jsonObject.fullname}.slice(1)"`;

    student.gender = jsonObject.gender;

    student.house = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();

    student.firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1).toLowerCase();

    if (fullName.length === 2) {
      student.lastName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1).toLowerCase();
    } else if (fullName.length === 3) {
      student.middleName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1).toLowerCase();
      student.lastName = fullName[2].charAt(0).toUpperCase() + fullName[2].slice(1).toLowerCase();
    }

    if (student.lastName == "Patil") {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
    } else {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
    }

    student.houseImage = `${student.house.toLowerCase()}.png`;

    student.id = uuidv4();

    if (student.bloodStatus == "") {
      student.bloodStatus = "Muggleborn";
    }

    allStudents.push(student);
    currentList.push(student);
  });

  rebuildList();
}

async function loadJSONBlood() {
  let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/families.json");

  bloodStatus = await jsonData.json();

  const halfBloodStatus = bloodStatus.half;
  const pureBloodStatus = bloodStatus.pure;

  findHalfBlood(halfBloodStatus);
  findPureBlood(pureBloodStatus);
}

function findHalfBlood(halfBloodStatus) {
  let half;

  halfBloodStatus.forEach(student => {
    half = student;

    allStudents.forEach(student => {
      if (student.lastName == half) {
        student.bloodStatus = "Halfblood";
      }
    });
  });
}

function findPureBlood(pureBloodStatus) {
  let pure;

  pureBloodStatus.forEach(student => {
    pure = student;

    allStudents.forEach(student => {
      if (student.lastName == pure) {
        student.bloodStatus = "Pureblood";
      }
    });
  });
  newBloodStatus();
}

function newBloodStatus() {
  //now I'm making the blood types random
  const BloodStatusArr = ["Pureblood", "Halfblood", "Muggleborn"];
  const newBloodStatus = BloodStatusArr[Math.floor(Math.random() * BloodStatusArr.length)];
  allStudents.forEach(student => {
    if (student.bloodStatus === "Halfblood" || student.bloodStatus === "Muggleborn") {
      student.bloodStatus = "Pureblood";
    } else {
      student.bloodStatus = newBloodStatus;
    }
  });
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

  sortCurrentStudents(sortButton);
}

function sortCurrentStudents(sortButton) {
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

function filterListBy(filterBy) {
  currentList = allStudents.filter(student => {
    return true;
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
  // we are clearing the list
  document.querySelector(".students").innerHTML = "";

  // we are building a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template").content.cloneNode(true);

  // set clone data
  clone.querySelector(".studentname").innerHTML = `${student.firstName} ${student.middleName} ${student.lastName}`;
  clone.querySelector(".house").innerHTML = student.house;

  //store the index on the button
  clone.querySelector("[data-action=remove]").dataset.id = student.id;
  clone.querySelector("[data-action=prefect]").dataset.id = student.id;

  clone.querySelector(".studentname").addEventListener("click", visSingle);

  // append clone to list
  document.querySelector(".studentcount").innerHTML = `Number of students in class: ${currentList.length}`;
  document.querySelector(".students").appendChild(clone);

  function visSingle() {
    document.querySelector("#indhold").innerHTML = `
                <article class="singlestudent">
                    <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
                    <p>${student.house}</p>
                    <p>${student.bloodStatus}</p>
                    <button class="inquBtn">Add to inquisitorial squad</button>
                </article>
                <article class="studentimage">
                <img src="images/${student.imageName}" alt="${student.firstName}" />
                </article>
                <article class="houseimage">
                <img src="images/${student.houseImage}" alt="${student.house}" />
                </article>
                   `;
    document.querySelector("#popup").style.display = "block";
    document.querySelector("#popup #luk").addEventListener("click", close);
    bloodStatus = `${student.bloodStatus}`;
    studentHouse = `${student.house}`;
    stylePopup(studentHouse);
  }

  function close() {
    document.querySelector("#popup").style.display = "none";
  }
}

function stylePopup(studentHouse) {
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

//The new, empty array should get the expelled students. This will be done with splicing of the index from the original array, and pushing them into the expelledList. Then an eventlistener that assures that you will see this new list, when clicking the button

function addingPrefectEvent(clickedStudent, element) {
  //console.log("addingPrefectEvent");
  let house = clickedStudent.house;
  console.log(clickedStudent);
  let prefectsInHouse = getPrefectsInHouse(house);
  console.log(prefectsInHouse);
  if (prefectsInHouse.length < 3) {
    addPrefect(clickedStudent, element);
  } else {
    showAlert(house, prefectsInHouse, element);
  }
}

function showAlert(house, prefectsInHouse) {
  //Show alert popup, insert textcontent, add eventlisteners(click => set student.prefect = false from prefectsInHouse, remove prefect color code)

  //It doesn't work entirely. The prefectsInHouse[0].fullName is undefined and doesn't show up. It worked for the people I solved this with and I have been starring myself blind on this over the weekend. I give up. I understand what's going on here, though...

  document.querySelector("#alert").style.display = "block";
  document.querySelector("#alert .p_top").textContent = "There are currently two prefects in " + house + ", you have to revoke the prefect status for one of them before adding a new";
  document.querySelector("#alert .stud_0").textContent = prefectsInHouse[0].fullName;
  document.querySelector("#alert .stud_0").addEventListener("click", function() {
    document.querySelector("#alert .stud_0").textContent = prefectsInHouse[0].fullName + " prefect status revoked!";
    prefectsInHouse[0].prefect = false;
    document.querySelectorAll(".prefect").forEach(prefectButton => {
      if (prefectButton.dataset.id == prefectsInHouse[0].id) {
        prefectButton.style.color = "white";
      }
    });
    setTimeout(function() {
      document.querySelector("#alert").style.display = "none";
    }, 3000);
  });

  document.querySelector("#alert .stud_1").textContent = prefectsInHouse[1].fullName;
  document.querySelector("#alert .stud_1").addEventListener("click", function() {
    document.querySelector("#alert .stud_1").textContent = prefectsInHouse[1].fullName + " prefect status revoked!";
    prefectsInHouse[1].prefect = false;
    document.querySelectorAll(".prefect").forEach(prefectButton => {
      if (prefectButton.dataset.id == prefectsInHouse[1].id) {
        prefectButton.style.color = "white";
      }
    });
    setTimeout(function() {
      document.querySelector("#alert").style.display = "none";
    }, 3000);
  });
}

function getPrefectsInHouse(house) {
  return allStudents.filter(student => {
    if (student.house === house) {
      if (student.prefect === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
}

function addPrefect(clickedStudent, element) {
  clickedStudent.prefect = true;
  element.style.color = "yellow";
}

//Add only pureblood or Slytherin students to the inqurisitorial squad using an if-statement. Something like if student.bloodStatus == "Pureblood" || student.house == "Slytherin".
//Then use setTimeout to revoke it after a few seconds, whenover you add someone, as we have now hacked Hogwarts and dismantled the squad!

// Our prototype Student
const Student = {
  firstName: "-firstName-",
  middleName: "",
  lastName: "",
  gender: "-gender-",
  house: "-house-",
  id: "-id",
  bloodStatus: "",
  prefect: false
};
