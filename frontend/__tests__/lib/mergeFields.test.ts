import { mergeNDAFields, mergeGenericFields } from "@/lib/mergeFields";
import { defaultFormData, NDAFormData, defaultGenericFormData, GenericDocFormData } from "@/lib/types";

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

const filledGenericParty = {
  company: "Acme Inc.",
  signatoryName: "Jane Smith",
  title: "CEO",
  noticeAddress: "jane@acme.com",
};

describe("mergeGenericFields", () => {
  it("returns current values unchanged when extracted object is empty", () => {
    expect(mergeGenericFields(defaultGenericFormData, {})).toEqual(defaultGenericFormData);
  });

  it("overwrites effectiveDate when extracted value is non-null", () => {
    const result = mergeGenericFields(defaultGenericFormData, { effectiveDate: "2026-03-01" });
    expect(result.effectiveDate).toBe("2026-03-01");
  });

  it("keeps current effectiveDate when extracted is null", () => {
    const current: GenericDocFormData = { ...defaultGenericFormData, effectiveDate: "2026-01-01" };
    const result = mergeGenericFields(current, { effectiveDate: null });
    expect(result.effectiveDate).toBe("2026-01-01");
  });

  it("overwrites term when provided", () => {
    const result = mergeGenericFields(defaultGenericFormData, { term: "1 year" });
    expect(result.term).toBe("1 year");
  });

  it("keeps current term when extracted is null", () => {
    const current: GenericDocFormData = { ...defaultGenericFormData, term: "2 years" };
    const result = mergeGenericFields(current, { term: null });
    expect(result.term).toBe("2 years");
  });

  it("overwrites governingLawState", () => {
    const result = mergeGenericFields(defaultGenericFormData, { governingLawState: "California" });
    expect(result.governingLawState).toBe("California");
  });

  it("overwrites specialTerms", () => {
    const result = mergeGenericFields(defaultGenericFormData, { specialTerms: "Monthly billing, $500/mo" });
    expect(result.specialTerms).toBe("Monthly billing, $500/mo");
  });

  it("does not touch party1 when extracted party1 is null", () => {
    const current: GenericDocFormData = { ...defaultGenericFormData, party1: filledGenericParty };
    const result = mergeGenericFields(current, { party1: null });
    expect(result.party1).toEqual(filledGenericParty);
  });

  it("merges party1 sub-fields, keeping existing for null sub-fields", () => {
    const current: GenericDocFormData = { ...defaultGenericFormData, party1: filledGenericParty };
    const result = mergeGenericFields(current, {
      party1: { company: "NewCo", signatoryName: null, title: null, noticeAddress: null },
    });
    expect(result.party1.company).toBe("NewCo");
    expect(result.party1.signatoryName).toBe("Jane Smith");
    expect(result.party1.title).toBe("CEO");
  });

  it("does not mutate the current object", () => {
    const current = { ...defaultGenericFormData };
    mergeGenericFields(current, { governingLawState: "Texas" });
    expect(current.governingLawState).toBe("");
  });
});
