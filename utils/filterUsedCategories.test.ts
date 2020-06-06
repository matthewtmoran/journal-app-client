import filterUsedCategories from "./filterUsedCategories";

test("Should filter used categories when none are used", () => {
  const used = [] as any;
  const all = [{ id: 1, name: "thought", color: "blue" }] as any;

  const result = filterUsedCategories(used, all);

  expect(result).toHaveLength(1);
  expect(result[0]).toBe(all[0]);
});

test("Shoudl return empty Array when all are used", () => {
  const used = [{ id: 1, name: "thought", color: "blue" }] as any;
  const all = [{ id: 1, name: "thought", color: "blue" }] as any;

  const result = filterUsedCategories(used, all);

  expect(result).toHaveLength(0);
  expect(result).toEqual([]);
});

test("Should filter used categories when some are used", () => {
  const used = [{ id: 1, name: "thought", color: "blue" }] as any;
  const all = [
    { id: 1, name: "thought", color: "blue" },
    { id: 2, name: "thoughts", color: "red" },
  ] as any;

  const result = filterUsedCategories(used, all);

  expect(result).toHaveLength(1);
  expect(result[0]).toBe(all[1]);
});
