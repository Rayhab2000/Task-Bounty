import { describe, expect, it } from "vitest";

import { TaskFilter, type FilterState } from "@/components/TaskFilter";

describe("TaskFilter module", () => {
  it("exports the TaskFilter component and FilterState typing surface", () => {
    expect(typeof TaskFilter).toBe("function");

    const filters: FilterState = {
      category: "All",
      contributor: "All",
      minReward: "",
      maxReward: "",
      startDate: "",
      endDate: "",
    };

    expect(filters.category).toBe("All");
  });
});
