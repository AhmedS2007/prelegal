import { defaultFormData } from "@/lib/types";

describe("defaultFormData", () => {
  it("has a non-empty purpose", () => {
    expect(defaultFormData.purpose.length).toBeGreaterThan(0);
  });

  it("defaults effectiveDate to today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(defaultFormData.effectiveDate).toBe(today);
  });

  it("defaults mndaTermType to expires", () => {
    expect(defaultFormData.mndaTermType).toBe("expires");
  });

  it("defaults mndaTermYears to 1", () => {
    expect(defaultFormData.mndaTermYears).toBe(1);
  });

  it("defaults confidentialityTermType to years", () => {
    expect(defaultFormData.confidentialityTermType).toBe("years");
  });

  it("defaults confidentialityTermYears to 1", () => {
    expect(defaultFormData.confidentialityTermYears).toBe(1);
  });

  it("has empty strings for all party fields", () => {
    const { party1, party2 } = defaultFormData;
    for (const party of [party1, party2]) {
      expect(party.company).toBe("");
      expect(party.signatoryName).toBe("");
      expect(party.title).toBe("");
      expect(party.noticeAddress).toBe("");
    }
  });

  it("has empty governingLawState", () => {
    expect(defaultFormData.governingLawState).toBe("");
  });

  it("has empty jurisdictionDescription", () => {
    expect(defaultFormData.jurisdictionDescription).toBe("");
  });

  it("has empty modifications", () => {
    expect(defaultFormData.modifications).toBe("");
  });
});
