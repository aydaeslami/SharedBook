import { getData, setData } from "./storage.js";

export function fetchDataForUser(userId) {
  const data = getData(userId);
  if (data === null) {
    return null;
  }
  return data;
}

export function saveDataForUser(userId, newBookmark) {
  let existingData = getData(userId);

  if (!Array.isArray(existingData)) {
    existingData = [];
  }

  existingData.push(newBookmark);
  setData(userId, existingData);
}

export function sortByDateDesc(data) {
  if (!Array.isArray(data)) return [];

  return [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}


