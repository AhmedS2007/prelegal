import { mergeNDAFields } from "@/lib/mergeFields";
import { defaultFormData, NDAFormData } from "@/lib/types";

const filledParty = {
  company: "Acme Inc.",
  signatoryName: "Jane Smith",
  title: "CEO",
  noticeAddress: "jane@acme.com",
};

describe("mergeNDAFields", () => {
  it("returns current values unchanged when extracted object is empty", () => {
    expect(mergeNDAFields(defaultFormData, {})).toEqual(defaultFormData);
  });

  it("overwrites a scalar field when extracted value is non-null", () => {
    const result = mergeNDAFields(defaultFormData, { governingLawState: "Texas" });
    expect(result.governingLawState).toBe("Texas");
  });

  it("keeps current value when extracted field is null", () => {
    const current: NDAFormData = { ...defaultFormData, governingLawState: "Delaware" };
    const result = mergeNDAFields(current, { governingLawState: null });
    expect(result.governingLawState).toBe("Delaware");
  });

  it("keeps current value when extracted field is undefined", () => {
    const current: NDAFormData = { ...defaultFormData, governingLawState: "Delaware" };
    const result = mergeNDAFields(current, {});
    expect(result.governingLawState).toBe("Delaware");
  });

  it("overwrites mndaTermType with valid enum value", () => {
    const result = mergeNDAFields(defaultFormData, { mndaTermType: "until_terminated" });
    expect(result.mndaTermType).toBe("until_terminated");
  });

  it("overwrites mndaTermYears with provided number (including 0)", () => {
    const result = mergeNDAFields(defaultFormData, { mndaTermYears: 5 });
    expect(result.mndaTermYears).toBe(5);
  });

  it("overwrites confidentialityTermType", () => {
    const result = mergeNDAFields(defaultFormData, { confidentialityTermType: "perpetuity" });
    expect(result.confidentialityTermType).toBe("perpetuity");
  });

  it("overwrites effectiveDate", () => {
    const result = mergeNDAFields(defaultFormData, { effectiveDate: "2026-01-01" });
    expect(result.effectiveDate).toBe("2026-01-01");
  });

  it("does not touch party1 when extracted party1 is null", () => {
    const current: NDAFormData = { ...defaultFormData, party1: filledParty };
    const result = mergeNDAFields(current, { party1: null });
    expect(result.party1).toEqual(filledParty);
  });

  it("merges party1 sub-fields, keeping existing values for null sub-fields", () => {
    const current: NDAFormData = { ...defaultFormData, party1: filledParty };
    const result = mergeNDAFields(current, {
      party1: { company: "NewCo", signatoryName: null, title: null, noticeAddress: null },
    });
    expect(result.party1.company).toBe("NewCo");
    expect(result.party1.signatoryName).toBe("Jane Smith");
    expect(result.party1.title).toBe("CEO");
    expect(result.party1.noticeAddress).toBe("jane@acme.com");
  });

  it("merges party2 independently of party1", () => {
    const result = mergeNDAFields(defaultFormData, {
      party2: { company: "Beta Corp", signatoryName: null, title: null, noticeAddress: null },
    });
    expect(result.party2.company).toBe("Beta Corp");
    expect(result.party1).toEqual(defaultFormData.party1);
  });

  it("does not mutate the current object", () => {
    const current = { ...defaultFormData };
    mergeNDAFields(current, { governingLawState: "Nevada" });
    expect(current.governingLawState).toBe("");
  });

  it("merges multiple scalar fields in one call", () => {
    const result = mergeNDAFields(defaultFormData, {
      governingLawState: "Nevada",
      jurisdictionDescription: "courts in Clark County, NV",
      mndaTermType: "expires",
      mndaTermYears: 3,
    });
    expect(result.governingLawState).toBe("Nevada");
    expect(result.jurisdictionDescription).toBe("courts in Clark County, NV");
    expect(result.mndaTermType).toBe("expires");
    expect(result.mndaTermYears).toBe(3);
  });
});
