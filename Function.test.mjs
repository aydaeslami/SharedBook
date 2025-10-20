import assert from "node:assert";
import test from "node:test";
import { getUserIds } from './storage.js';
import { getUserIds } from './Functions.mjs';



test('getUserIds returns something', () => {
  const ids = getUserIds();
  assert.ok(ids); 
});


test("return data",()=>
{
  const userId=1;
  
})
