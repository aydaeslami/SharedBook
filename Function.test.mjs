import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./storage.js";
import { sortByDateDesc } from "./Functions.mjs";

test("getUserIds returns something", () => {
  const ids = getUserIds();
  assert.ok(ids);
});

test("sortByDateDesc sorts bookmarks by time from newest to oldest", () => {
  const bookmarks = [
    { title: "Morning", createdAt: "2023-01-03T08:00:00Z" }, // 8 AM
    { title: "Evening", createdAt: "2023-01-03T20:00:00Z" }, // 8 PM
    { title: "Afternoon", createdAt: "2023-01-03T15:00:00Z" }, // 3 PM
  ];

  const sorted = sortByDateDesc(bookmarks);

  // 8 AM,3 PM, 8PM
  assert.deepEqual(
    sorted.map((b) => b.title),
    ["Evening", "Afternoon", "Morning"]
  );
});
