// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.
let userName = "Guest";
let dataForUser = [];
let userIndex = "";
import { getData, getUserIds, clearData } from "./storage.js";
import { fetchDataForUser, saveDataForUser } from "./Functions.mjs";

window.onload = function () {
  document.getElementById("userName").textContent = "User is: " + userName;
  const users = getUserIds();
  fillUserList(users);

  console.log("User selected:", userName);

  dataForUser = fetchDataForUser(userName);

  ///// test it later
  const selectElement = document.getElementById("userSelect");
  const bookmarkList = document.getElementById("bookmarkList");
  const submitButton = document.getElementById("submitBtn");
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
  if (userIndex) {
    const bookmarkName = document.getElementById("bookmarkName").value;
    const bookmarkUrl = document.getElementById("bookmarkUrl").value;
    const bookmarkDesc = document.getElementById("bookmarkDesc").value;

    /// validate inputs
    if (bookmarkName && bookmarkUrl) {
      saveDataForUser(userIndex, {
        name: bookmarkName,
        url: bookmarkUrl,
        description: bookmarkDesc,
        createdAt: new Date().toISOString(),
      });
      // Add your form submission logic here
      showBookmarks(userIndex);
    }
  }  else {
    alert("Please select a user before adding a bookmark.");
  }
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
      
      <a href="${item.url}" target="_blank"><strong>${item.name}</strong><br></a><br>
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

  clearInputFieldsFun();
}
function deleteBtnFun() {
  for (let i = 1; i <= 5; i++) {
    clearData(i.toString());
  }
}

// deleteBtnFun();
function clearInputFieldsFun() {
  document.getElementById("bookmarkName").value = "";
  document.getElementById("bookmarkUrl").value = "";
  document.getElementById("bookmarkDesc").value = "";
}
