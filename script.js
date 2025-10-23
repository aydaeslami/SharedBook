// Import helper functions from other modules
import { getData, getUserIds, clearData } from "./storage.js";
import {
  fetchDataForUser,
  saveDataForUser,
  sortByDateDesc,
} from "./Functions.mjs";

// Global variables
let dataForUser = []; // Stores bookmarks for the currently selected user
let userIndex = "";   // The current user's ID (selected from the dropdown)

// Initialize the app after the window has loaded
window.onload = function () {
  const users = getUserIds(); // Retrieve all existing user IDs
  fillUserList(users); // Populate the dropdown list with users

  // Get important DOM elements
  const selectElement = document.getElementById("userSelect");
  const deleteButton = document.getElementById("deleteBtn");
  const form = document.getElementById("bookmarkForm");
  const descField = document.getElementById("bookmarkDesc");

  // Attach event listeners
  selectElement.addEventListener("change", handleUserChangeFun);
  form.addEventListener("submit", submitBtnFun);
  deleteButton.addEventListener("click", deleteBtnFun);

  // Allow pressing "Enter" inside the description field to submit the form
  descField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.requestSubmit(); // Trigger form submission manually
    }
  });
};

// Handle form submission for adding a new bookmark
function submitBtnFun(event) {
  event.preventDefault(); // Prevent default form behavior

  // Get user input values and remove extra spaces
  const bookmarkName = document.getElementById("bookmarkName").value.trim();
  const bookmarkUrl = document.getElementById("bookmarkUrl").value.trim();
  const bookmarkDesc = document.getElementById("bookmarkDesc").value.trim();

  // Check if a user is selected
  if (!userIndex) {
    alert("Please select a user before adding a bookmark.");
    return;
  }

  // Validate required fields
  if (!bookmarkName || !bookmarkDesc) {
    alert("Title and Description cannot be empty or contain only spaces.");
    return;
  }

  // Save bookmark data for the current user
  saveDataForUser(userIndex, {
    name: bookmarkName,
    url: bookmarkUrl,
    description: bookmarkDesc,
    createdAt: new Date().toISOString(), // Add timestamp
  });

  // Refresh bookmarks list
  showBookmarks(userIndex);

  // Clear input fields after submission
  clearInputFieldsFun();
}

// Display bookmarks for the selected user
function showBookmarks(userIndex) {
  const data = getData(userIndex);
  const bookmarkList = document.getElementById("bookmarkList");
  bookmarkList.innerHTML = ""; // Clear current list

  // If no data, show message
  if (!data || data.length === 0) {
    bookmarkList.innerHTML = `<em>User ${userIndex} has no bookmarks yet.</em>`;
    return;
  }

  // Sort data by creation date (descending)
  const sortedData = sortByDateDesc(data);

  // Create HTML for each bookmark item
  sortedData.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <a href="${item.url}" target="_blank">
        <strong>${item.name}</strong><br>
      </a><br>
      <small>${item.description || ""}</small><br>
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

// Delete all bookmarks for all users (or can be limited to selected user)
function deleteBtnFun() {
  for (let i = 1; i <= 5; i++) {
    clearData(i.toString());
  }
  const bookmarkList = document.getElementById("bookmarkList");
  bookmarkList.innerHTML = `<em>All bookmarks have been deleted.</em>`;
}

// Clear all input fields after adding a bookmark
function clearInputFieldsFun() {
  document.getElementById("bookmarkName").value = "";
  document.getElementById("bookmarkUrl").value = "";
  document.getElementById("bookmarkDesc").value = "";
}

// Populate the user dropdown with all available user IDs
function fillUserList(users) {
  const userSelect = document.getElementById("userSelect");
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.innerText = `User ${userId}`;
    userSelect.appendChild(option);
  });
}

// Handle user change from the dropdown
function handleUserChangeFun(event) {
  userIndex = event.target.value; // Update current user ID
  const userNameLabel = document.getElementById("userName");
  const bookmarkList = document.getElementById("bookmarkList");

  // Update the display label for the selected user
  userNameLabel.textContent = "User " + userIndex + " is selected";

  // Fetch stored data for this user
  dataForUser = fetchDataForUser(userIndex);

  // Show the bookmarks or a message if none exist
  if (dataForUser !== null) {
    showBookmarks(userIndex);
  } else {
    bookmarkList.innerHTML = `<em>User ${userIndex} has no bookmarks yet.</em>`;
  }
}
