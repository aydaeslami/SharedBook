import { getData, getUserIds, clearData } from "./storage.js";
import {
  fetchDataForUser,
  saveDataForUser,
  sortByDateDesc,
} from "./Functions.mjs";

let dataForUser = [];
let userIndex = "";

window.onload = function () {
  const users = getUserIds();
  fillUserList(users);

  const selectElement = document.getElementById("userSelect");
  const deleteButton = document.getElementById("deleteBtn");
  const form = document.getElementById("bookmarkForm");
  const descField = document.getElementById("bookmarkDesc");

  selectElement.addEventListener("change", handleUserChangeFun);
  form.addEventListener("submit", submitBtnFun);
  deleteButton.addEventListener("click", deleteBtnFun);

  descField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.requestSubmit();
    }
  });
};

// handle form submission
function submitBtnFun(event) {
  event.preventDefault();

  const bookmarkName = document.getElementById("bookmarkName").value.trim();
  const bookmarkUrl = document.getElementById("bookmarkUrl").value.trim();
  const bookmarkDesc = document.getElementById("bookmarkDesc").value.trim();

  if (!userIndex) {
    alert("Please select a user before adding a bookmark.");
    return;
  }

  // validate inputs
  if (!bookmarkName || !bookmarkDesc) {
    alert("Title and Description cannot be empty or spaces only.");
    return;
  }

  saveDataForUser(userIndex, {
    name: bookmarkName,
    url: bookmarkUrl,
    description: bookmarkDesc,
    createdAt: new Date().toISOString(),
  });

  showBookmarks(userIndex);
  clearInputFieldsFun();
}

function showBookmarks(userIndex) {
  const data = getData(userIndex);
  const bookmarkList = document.getElementById("bookmarkList");
  bookmarkList.innerHTML = "";

  if (!data || data.length === 0) {
    bookmarkList.innerHTML = `<em>User ${userIndex} has no bookmarks yet.</em>`;
    return;
  }
  const sortedData = sortByDateDesc(data);
  sortedData.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
        
        <a href="${item.url}" target="_blank"><strong>${
      item.name
    }</strong><br></a><br>
        <small>${item.description || ""}</small>       <br>


  <small>
    Created at: ${new Date(item.createdAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </small>
        <hr>
      `;
    bookmarkList.appendChild(div);
  });
}
function deleteBtnFun() {
  for (let i = 1; i <= 5; i++) {
    clearData(i.toString());
  }
  const bookmarkList = document.getElementById("bookmarkList");
  bookmarkList.innerHTML = `<em>All bookmarks have been deleted.</em>`;
}

function clearInputFieldsFun() {
  document.getElementById("bookmarkName").value = "";
  document.getElementById("bookmarkUrl").value = "";
  document.getElementById("bookmarkDesc").value = "";
}
function fillUserList(users) {
  const userSelect = document.getElementById("userSelect");
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.innerText = `User ${userId}`;
    userSelect.appendChild(option);
  });
}

function handleUserChangeFun(event) {
  userIndex = event.target.value;
  const userNameLabel = document.getElementById("userName");
  const bookmarkList = document.getElementById("bookmarkList");

  userNameLabel.textContent = "User " + userIndex + " is selected";
  dataForUser = fetchDataForUser(userIndex);

  if (dataForUser !== null) {
    showBookmarks(userIndex);
  } else {
    bookmarkList.innerHTML = `<em>User ${userIndex} has no bookmarks yet.</em>`;
  }
}
