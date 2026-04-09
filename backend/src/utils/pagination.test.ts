import test from "node:test";
import assert from "node:assert/strict";
import { buildPaginationMeta } from "./pagination";

test("buildPaginationMeta reports navigation state correctly", () => {
  const result = buildPaginationMeta(42, 2, 10);

  assert.deepEqual(result, {
    total: 42,
    page: 2,
    pageSize: 10,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: true,
  });
});

test("buildPaginationMeta keeps at least one page for empty result sets", () => {
  const result = buildPaginationMeta(0, 1, 10);

  assert.equal(result.totalPages, 1);
  assert.equal(result.hasNextPage, false);
  assert.equal(result.hasPreviousPage, false);
});
