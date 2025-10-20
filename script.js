let userName = "Guest";
let dataForUser = [];
let userIndex = "";
import { getData, getUserIds, clearData } from "./storage.js";
import { fetchDataForUser, saveDataForUser } from "./Functions.mjs";

window.onload = function () {
  document.getElementById("userName").textContent = "User is: " + userName;
  const users = getUserIds();
  fillUserList(users);

  dataForUser = fetchDataForUser(userName);

  ///// test it later
  const selectElement = document.getElementById("userSelect");
  const deleteButton = document.getElementById("deleteBtn");

  // handle user change
  selectElement.addEventListener("change", handleUserChangeFun);

  // handle form submission
  const form = document.getElementById("bookmarkForm");
  form.addEventListener("submit", submitBtnFun);

  // handle delete button
  deleteButton.addEventListener("click", deleteBtnFun);

  function fillUserList(users) {
    console.log("Filling user list with users:", users);
    const userSelect = document.getElementById("userSelect");
    users.forEach((userId) => {
      const option = document.createElement("option");
      option.value = userId;
      option.innerText = `User ${userId}`;
      userSelect.appendChild(option);
    });
  }

  // handle user change
  function handleUserChangeFun(event) {
    userIndex = event.target.value;
    const userNameLabel = document.getElementById("userName");
    const bookmarkList = document.getElementById("bookmarkList");

    userNameLabel.textContent = "User is: " + userIndex;
    dataForUser = fetchDataForUser(userIndex);

    if (dataForUser !== null) {
      console.log("Data for user:", userIndex);
      showBookmarks(userIndex);
    } else {
      console.log("No data found for user", userIndex);
      bookmarkList.innerHTML = `<em>User ${userIndex} has no bookmarks yet.</em>`;
    }
  }

  // make Enter in textarea submit the form instead of new line
  const descField = document.getElementById("bookmarkDesc");

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

  if (!userIndex) {
    alert("Please select a user before adding a bookmark.");
    return;
  }

  const bookmarkName = document.getElementById("bookmarkName").value.trim();
  const bookmarkUrl = document.getElementById("bookmarkUrl").value.trim();
  const bookmarkDesc = document.getElementById("bookmarkDesc").value.trim();

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
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  data.forEach((item) => {
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
}

function clearInputFieldsFun() {
  document.getElementById("bookmarkName").value = "";
  document.getElementById("bookmarkUrl").value = "";
  document.getElementById("bookmarkDesc").value = "";
}
