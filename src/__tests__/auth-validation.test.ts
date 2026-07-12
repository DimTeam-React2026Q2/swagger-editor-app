import { describe, it, expect } from "vitest";
import { signInSchema, signUpSchema } from "@/lib/auth/validation";

describe("signInSchema", (): void => {
  it("accepts a valid email and non-empty password", (): void => {
    const r = signInSchema.safeParse({ email: "a@b.com", password: "x" });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid email", (): void => {
    const r = signInSchema.safeParse({ email: "nope", password: "x" });
    expect(r.success).toBe(false);
  });

  it("rejects an empty password", (): void => {
    const r = signInSchema.safeParse({ email: "a@b.com", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("signUpSchema", (): void => {
  it("accepts a strong password", (): void => {
    const r = signUpSchema.safeParse({
      email: "a@b.com",
      password: "abcd1234!",
    });
    expect(r.success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", (): void => {
    const r = signUpSchema.safeParse({ email: "a@b.com", password: "ab1!" });
    expect(r.success).toBe(false);
  });

  it("rejects a password with no letter", (): void => {
    const r = signUpSchema.safeParse({
      email: "a@b.com",
      password: "1234567!",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a password with no digit", (): void => {
    const r = signUpSchema.safeParse({
      email: "a@b.com",
      password: "abcdefg!",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a password with no special character", (): void => {
    const r = signUpSchema.safeParse({
      email: "a@b.com",
      password: "abcd1234",
    });
    expect(r.success).toBe(false);
  });
});
