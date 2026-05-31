export interface Party {
  company: string;
  signatoryName: string;
  title: string;
  noticeAddress: string;
}

export interface NDAFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: "expires" | "until_terminated";
  mndaTermYears: number;
  confidentialityTermType: "years" | "perpetuity";
  confidentialityTermYears: number;
  governingLawState: string;
  jurisdictionDescription: string;
  modifications: string;
  party1: Party;
  party2: Party;
}

export const defaultFormData: NDAFormData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermType: "expires",
  mndaTermYears: 1,
  confidentialityTermType: "years",
  confidentialityTermYears: 1,
  governingLawState: "",
  jurisdictionDescription: "",
  modifications: "",
  party1: {
    company: "",
    signatoryName: "",
    title: "",
    noticeAddress: "",
  },
  party2: {
    company: "",
    signatoryName: "",
    title: "",
    noticeAddress: "",
  },
};
