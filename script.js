// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.
let userName = "Guest";
let dataForUser = [];
let userIndex = "";
import { getData, getUserIds } from "./storage.js";
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

  // handle user change
  selectElement.addEventListener("change", handleUserChangeFun);

  // handle form submission
  submitButton.addEventListener("click", submitBtnFun);

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

  // handle form submission
  function submitBtnFun(event) {
    event.preventDefault();
    console.log("Submit button clicked");

    const bookmarkName = document.getElementById("bookmarkName").value;
    const bookmarkUrl = document.getElementById("bookmarkUrl").value;
    const bookmarkDesc = document.getElementById("bookmarkDesc").value;

    /// validate inputs
    if (bookmarkName && bookmarkUrl) {
      saveDataForUser(userIndex, {
        name: bookmarkName,
        url: bookmarkUrl,
        description: bookmarkDesc,
      });
      // Add your form submission logic here
      showBookmarks(userIndex);
    } else {
      console.log("Bookmark name and URL are required.");
    }
  }
};

function showBookmarks(userIndex) {
  const data = getData(userIndex);
  const bookmarkList = document.getElementById("bookmarkList");

  bookmarkList.innerHTML = ""; // پاک کردن لیست قبلی

  if (!data || data.length === 0) {
    bookmarkList.innerHTML = `<em>User ${userIndex} has no bookmarks yet.</em>`;
    return;
  }

  data.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      <a href="${item.url}" target="_blank">${item.url}</a><br>
      <small>${item.description || ""}</small>
      <hr>
    `;
    bookmarkList.appendChild(div);
  });

  console.log("Bookmarks for user", userIndex, data);
}

