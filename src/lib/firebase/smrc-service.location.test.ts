/**
 * Unit tests for SMRC state/city filter: stateCanonical and reviewMatchesLocationFilter.
 * Run from client: npm test (or npx vitest run)
 */
import { describe, it, expect } from "vitest";
import { stateCanonical, reviewMatchesLocationFilter } from "./smrc-location-utils";

describe("stateCanonical", () => {
  it("normalizes US state full names to lowercase abbreviation", () => {
    expect(stateCanonical("Texas")).toBe("tx");
    expect(stateCanonical("California")).toBe("ca");
    expect(stateCanonical("Arizona")).toBe("az");
    expect(stateCanonical("New York")).toBe("ny");
  });

  it("keeps 2-letter state codes as lowercase", () => {
    expect(stateCanonical("TX")).toBe("tx");
    expect(stateCanonical("tx")).toBe("tx");
    expect(stateCanonical("CA")).toBe("ca");
  });

  it("handles mixed casing", () => {
    expect(stateCanonical("TEXAS")).toBe("tx");
    expect(stateCanonical("TeXas")).toBe("tx");
  });

  it("strips trailing , USA / , US", () => {
    expect(stateCanonical("Texas, USA")).toBe("tx");
    expect(stateCanonical("Texas, US")).toBe("tx");
    expect(stateCanonical("California , USA")).toBe("ca");
  });

  it("extracts 2-letter code from parentheses", () => {
    expect(stateCanonical("Texas (TX)")).toBe("tx");
    expect(stateCanonical("California (CA)")).toBe("ca");
  });

  it("returns empty string for null/undefined/empty", () => {
    expect(stateCanonical(null)).toBe("");
    expect(stateCanonical(undefined)).toBe("");
    expect(stateCanonical("")).toBe("");
    expect(stateCanonical("   ")).toBe("");
  });

  it("trims whitespace", () => {
    expect(stateCanonical("  Texas  ")).toBe("tx");
  });
});

describe("reviewMatchesLocationFilter", () => {
  it("includes review with state only when query state matches (state-level aggregation)", () => {
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: null },
        "Texas",
        null,
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: "Houston" },
        "Texas",
        null,
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "California", city: "Los Angeles" },
        "Texas",
        null,
      ),
    ).toBe(false);
  });

  it("includes review with city and state when filtering by state", () => {
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: "Houston" },
        "Texas",
        null,
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "TX", city: "Houston" },
        "Texas",
        null,
      ),
    ).toBe(true);
  });

  it("includes review with state only (no city) when filtering by state", () => {
    expect(
      reviewMatchesLocationFilter(
        { state: "Arizona", city: "" },
        "Arizona",
        null,
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "AZ", city: undefined },
        "Arizona",
        null,
      ),
    ).toBe(true);
  });

  it("handles mixed casing for state", () => {
    expect(
      reviewMatchesLocationFilter(
        { state: "TEXAS", city: "Houston" },
        "Texas",
        null,
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: "Houston" },
        "TX",
        null,
      ),
    ).toBe(true);
  });

  it("includes review when city matches (case-insensitive)", () => {
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: "Houston" },
        "Texas",
        "Houston",
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: "HOUSTON" },
        null,
        "Houston",
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: "  houston  " },
        "Texas",
        "Houston",
      ),
    ).toBe(true);
  });

  it("returns true when no state or city in query (no location filter)", () => {
    expect(
      reviewMatchesLocationFilter(
        { state: "Texas", city: "Houston" },
        null,
        null,
      ),
    ).toBe(true);
    expect(
      reviewMatchesLocationFilter(
        { state: "", city: "" },
        "",
        "",
      ),
    ).toBe(true);
  });

  it("does not double-count: one review matches state OR city once", () => {
    const review = { state: "Texas", city: "Houston" };
    const matches = reviewMatchesLocationFilter(review, "Texas", "Houston");
    expect(matches).toBe(true);
  });
});
