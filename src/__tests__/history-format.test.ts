import { describe, it, expect } from "vitest";
import {
  formatBytes,
  formatDuration,
  statusColorClass,
} from "@/lib/history/format";

describe("formatBytes", (): void => {
  it("handles invalid/negative as 0 B", (): void => {
    expect(formatBytes(-5)).toBe("0 B");
    expect(formatBytes(NaN)).toBe("0 B");
  });

  it("formats bytes, KB, and MB", (): void => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(1024 * 1024 * 3)).toBe("3.0 MB");
  });
});

describe("formatDuration", (): void => {
  it("handles invalid/negative as 0 ms", (): void => {
    expect(formatDuration(-1)).toBe("0 ms");
    expect(formatDuration(NaN)).toBe("0 ms");
  });

  it("formats ms under a second and seconds above", (): void => {
    expect(formatDuration(250)).toBe("250 ms");
    expect(formatDuration(999)).toBe("999 ms");
    expect(formatDuration(1500)).toBe("1.50 s");
  });
});

describe("statusColorClass", (): void => {
  it("maps status classes to colors", (): void => {
    expect(statusColorClass(0)).toContain("rose");
    expect(statusColorClass(200)).toContain("emerald");
    expect(statusColorClass(301)).toContain("amber");
    expect(statusColorClass(404)).toContain("rose");
    expect(statusColorClass(500)).toContain("rose");
  });
});
