import filterCategories from "./filterDuplicateCategories";
import ICategory from "../interfaces/ICategory";

test("Should filter duplicate categories with matches", () => {
  const used = [{ id: 1, name: "thought", color: "blue" }] as any[];
  const unused = [{ id: 1, name: "thought", color: "blue" }] as any[];
  const result = filterCategories(used, unused);
  expect(result.length).toBe(1);
  expect(result[0]).toEqual(used[0]);
});

test("Should filter duplicate categories without matches", () => {
  const used = [{ id: 1, name: "thought", color: "blue" }] as any[];
  const unused = [{ id: 2, name: "thoughts", color: "red" }] as any[];
  const result = filterCategories(used, unused);
  expect(result.length).toBe(2);
  expect(result[0]).toBe(used[0]);
  expect(result[1]).toBe(unused[0]);
});

test("Should filter with empty array", () => {
  const used = [{ id: 1, name: "thought", color: "blue" }] as any[];
  const unused = [] as any[];
  const result = filterCategories(used, unused);
  expect(result.length).toBe(1);
  expect(result[0]).toBe(used[0]);
});

test("Should filter with empty array", () => {
  const used = [] as any[];
  const unused = [{ id: 2, name: "thoughts", color: "red" }] as any[];
  const result = filterCategories(used, unused);
  expect(result.length).toBe(1);
  expect(result[0]).toBe(unused[0]);
});

test("Should filter with empty arrays", () => {
  const used = [] as any[];
  const unused = [] as any[];
  const result = filterCategories(used, unused);
  expect(result.length).toBe(0);
});
