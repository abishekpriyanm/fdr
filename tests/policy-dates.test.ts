import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_POLICY } from "../src/server/policy";
import { addCalendarDays, applicationDate, parseCalendarDate } from "../src/server/policy/dates";

test("application date crosses midnight in India even while UTC is the previous date", () => {
  assert.equal(applicationDate(new Date("2026-10-28T18:29:59Z")), "2026-10-28");
  assert.equal(applicationDate(new Date("2026-10-28T18:30:00Z")), "2026-10-29");
});

test("date-only parsing rejects impossible or ambiguous financial dates", () => {
  for (const value of ["2026-02-29", "2026-04-31", "2026-13-01", "29/10/2026", "2026-1-01", "0000-01-01"]) {
    assert.throws(() => parseCalendarDate(value), RangeError);
  }
  assert.equal(parseCalendarDate("2028-02-29"), "2028-02-29");
});

test("calendar arithmetic preserves leap, month and year boundaries", () => {
  assert.equal(addCalendarDays(parseCalendarDate("2028-02-28"), 1), "2028-02-29");
  assert.equal(addCalendarDays(parseCalendarDate("2028-02-29"), 1), "2028-03-01");
  assert.equal(addCalendarDays(parseCalendarDate("2026-12-31"), 1), "2027-01-01");
  assert.equal(addCalendarDays(parseCalendarDate("2026-03-01"), -1), "2026-02-28");
  assert.throws(() => addCalendarDays(parseCalendarDate("2026-10-29"), 0.5), RangeError);
});

test("the fixed policy cannot be reassigned at runtime", () => {
  assert.throws(() => Object.assign(DEMO_POLICY, { currency: "USD" }), TypeError);
});
