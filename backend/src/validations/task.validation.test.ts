import test from "node:test";
import assert from "node:assert/strict";
import {
  createTaskSchema,
  getTasksSchema,
  updateTaskSchema,
} from "./task.validation";

test("createTaskSchema trims title and accepts ISO due dates", () => {
  const result = createTaskSchema.parse({
    title: "  Plan sprint  ",
    description: "  Prioritize blockers  ",
    dueDate: "2026-04-08T10:00:00.000Z",
  });

  assert.equal(result.title, "Plan sprint");
  assert.equal(result.description, "Prioritize blockers");
  assert.equal(result.dueDate, "2026-04-08T10:00:00.000Z");
});

test("updateTaskSchema rejects empty payloads", () => {
  assert.throws(() => updateTaskSchema.parse({}), {
    message: /At least one field is required for update/,
  });
});

test("updateTaskSchema accepts null dueDate to clear an existing deadline", () => {
  const result = updateTaskSchema.parse({ dueDate: null });

  assert.equal(result.dueDate, null);
});

test("updateTaskSchema allows clearing a description with an empty string", () => {
  const result = updateTaskSchema.parse({ description: "" });

  assert.equal(result.description, null);
});

test("getTasksSchema applies defaults for pagination", () => {
  const result = getTasksSchema.parse({});

  assert.equal(result.page, 1);
  assert.equal(result.pageSize, 10);
  assert.equal(result.sortBy, undefined);
});

test("getTasksSchema rejects page sizes over the allowed limit", () => {
  assert.throws(() => getTasksSchema.parse({ pageSize: "100" }));
});
