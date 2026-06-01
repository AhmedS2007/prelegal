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

export interface ExtractedParty {
  company?: string | null;
  signatoryName?: string | null;
  title?: string | null;
  noticeAddress?: string | null;
}

export interface ExtractedNDAFields {
  purpose?: string | null;
  effectiveDate?: string | null;
  mndaTermType?: "expires" | "until_terminated" | null;
  mndaTermYears?: number | null;
  confidentialityTermType?: "years" | "perpetuity" | null;
  confidentialityTermYears?: number | null;
  governingLawState?: string | null;
  jurisdictionDescription?: string | null;
  modifications?: string | null;
  party1?: ExtractedParty | null;
  party2?: ExtractedParty | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
