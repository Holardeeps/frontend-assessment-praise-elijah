import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// This clears the rendered DOM after every test so each spec starts from the
// same clean state and does not leak UI between test cases.
afterEach(() => {
  cleanup();
});
